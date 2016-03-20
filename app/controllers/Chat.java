package controllers;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import models.UsuarioChat;
import models.UsuariosChat;
import play.Logger;
import play.libs.F.Callback;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.WebSocket;
import play.mvc.WebSocket.Out;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;


public class Chat extends Controller {
	
	private static UsuariosChat UsuariosConectados = new UsuariosChat();
	
    private static List<WebSocket.Out<String>> connections = new ArrayList<WebSocket.Out<String>>();	
    
	public static Result transmitir(String msg) {	

		for (UsuarioChat Usuario : UsuariosConectados.TodosUsuarios()){
			Usuario.websocket.write(msg);
		}
		return ok(msg);		
	}			
	
	public static Result ListaUsuarios() throws JSONException{
		JSONObject  jLogados = new JSONObject();
		JSONArray  listaUsuarios = new JSONArray();		
	      for (UsuarioChat user : UsuariosConectados.TodosUsuarios()){
	    	JSONObject jAux = new JSONObject();	    	
	    	jAux.put("pID",user.getID() );	    	
	        jAux.put("pNome",user.getNome() );		    
	        jAux.put("pImagem",user.getImagem() );
	        
	        listaUsuarios.put(jAux);
	      }	      

	       jLogados.put("listausuarios",listaUsuarios);
	      
	      return ok(jLogados.toString());    
	}		
	public static Result logoff(String pID,boolean pbInatividade) throws JSONException {
		String newmsg = "";
		JSONObject jAux = new JSONObject();		
		UsuarioChat delusuario = null;
		for (UsuarioChat usuario: UsuariosConectados.TodosUsuarios()){
			if (usuario.getID().equals(pID )){
				newmsg =  usuario.getNome();
				delusuario = usuario; 
	      				
				if (pbInatividade){
					newmsg =  newmsg + ": saiu da sala por inatividade";
				}else
				{
					newmsg =  newmsg + ": saiu da sala";
				}

				ObjectNode result = Json.newObject();
				result.put("evt", "Chat_SendMsg");							
				result.put("msg", newmsg);								
				for (WebSocket.Out<String> out : connections ) {
					out.write(result.toString());
				}							

				ObjectNode result2 = Json.newObject();
				result2.put("evt", "AtualizarLogados");							
				result2.put("msg", "usuariosconectados");								
				for (WebSocket.Out<String> out : connections ) {
					out.write(result2.toString());
				}							
				usuario.websocket.close();		        
            				
			} 
		}
		if (!delusuario.equals(null)){
			UsuariosConectados.Remover(delusuario.getID());			
		} 

		if (newmsg.equals("")){
			return ok("vazio");
		}else{
			return ok(jAux.toString());			
		}

	}
	
	
	public static WebSocket<String> wslogin(final String pID,final String pNome,final String pImagem) {		
		return new WebSocket<String>() {
				public void onReady(WebSocket.In<String> in,final WebSocket.Out<String> out) {					
		        connections.add(out);		        
				in.onMessage(new Callback<String>() {
					public void invoke(String event) {
						//String sTempID = pID;
						boolean bJaLogado = false;
						for (UsuarioChat usuario : UsuariosConectados.TodosUsuarios()){
							if (usuario.getID().equals(pID )){
								bJaLogado = true;
							}
						}
						if (!bJaLogado){
							UsuarioChat NovoUsuario = new UsuarioChat(pID,pNome,pImagem,out);						
							UsuariosConectados.Adicionar(NovoUsuario);
						}else{
							// altera o websocket do usuario...
						}
							
							Logger.info("WebConnection ->  Login03" );
								
							String newmsg = pNome + ": entrou na sala.";
							ObjectNode result = Json.newObject();
							result.put("evt", "Chat_SendMsg");
							result.put("msg", newmsg);
							Logger.info("WebConnection ->  "+ result.toString() );
							for (WebSocket.Out<String> out : connections ) {
								out.write(result.toString());
							}

						//solicitar atualizar lista de usuarios							
						ObjectNode result2 = Json.newObject();
						result2.put("evt", "AtualizarLogados");							
						result2.put("msg", "usuariosconectados");								
						for (WebSocket.Out<String> out : connections ) {
							out.write(result2.toString());
						}							
					}				
				});
			}
		};
	}

}

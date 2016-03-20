package models;

import java.util.ArrayList;
import play.Logger;
import play.db.ebean.Model;
import play.libs.Json;

public class UsuariosChat extends Model {

	private ArrayList<UsuarioChat> Usuarios  ;
	
	public UsuariosChat()  {
		
		this.Usuarios = new ArrayList<UsuarioChat>();
	}
	

	public void Adicionar(UsuarioChat NovoUsuario){
		Logger.info("UsuariosChat -> Adicionando usuariochat ????" );
		Usuarios.add(NovoUsuario);
		Logger.info("UsuariosChat -> Adicionado usuariochat  ok!" );
	}
/*
	public ArrayList<UsuarioChat> ListaUsuarios(){
		
		ArrayList<UsuarioChat> result  = new ArrayList<UsuarioChat>();
		for(UsuarioChat Usuario : Usuarios) 
		{
			result.add(Usuario);  
		}
			
		return result;		
	}
	
	public ArrayList<UsuarioChat> ListaInfoUsuario(){	
		ArrayList<UsuarioChat> result  = new ArrayList<UsuarioChat>();
		if (!result.isEmpty()) {
			Logger.info("Limpando --- só podia ser aqui!!!!! " );
			result.clear();
		}
		for(UsuarioChat Usuario : Usuarios) 
		{
			result.add(Usuario);  
		}

		for(UsuarioChat Usuario : result) 
		{
			Usuario.setwebsocket(null);			
		}
		
		return result;		
	}	
	
*/	
	public ArrayList<UsuarioChat> TodosUsuarios(){	
		  return Usuarios;		  		  
	}		
	
	public void Remover(String piID, Boolean pbInatividade){
		for (UsuarioChat usuario: Usuarios) {
			  if (usuario.getID().equals(piID)){
				  Usuarios.remove(usuario);
			  }
		}
	}
	
}

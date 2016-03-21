package models;

import java.util.ArrayList;
import play.Logger;
import play.db.ebean.Model;
import play.libs.Json;

/**
 * @author cesar.pamplona
 *
 */
public class UsuariosChat extends Model {

	private ArrayList<UsuarioChat> Usuarios  ;
	
	/**
	 * Constructor
	 */
	public UsuariosChat()  {
		
		this.Usuarios = new ArrayList<UsuarioChat>();
	}
	
	/**
	 * Metodo adiciona UsuarioChat oa ArrayList Usuarios
	 * @param NovoUsuario
	 */
	public void Adicionar(UsuarioChat NovoUsuario){
		Usuarios.add(NovoUsuario);
	}

	/**
	 * Metodo retorna todos os usuarios do ArrayList Usuarios
	 * @return
	 */
	public ArrayList<UsuarioChat> TodosUsuarios(){	
		  return Usuarios;		  		  
	}		
	
	/**
	 * MEtodo remove usuario do ArrayList Usuarios
	 * @param pID
	 */
	public void Remover(String pID){
		this.Usuarios.remove(this.getUsuario(pID));
	}
		
	/**
	 * MEtodo retorna o usuario do Array List Usuario passando como parametro ID do Google do usuario.
	 * @param pID
	 * @return
	 */
	public UsuarioChat getUsuario(String pID)
	{      
		for(UsuarioChat usuario : Usuarios) 
		{
			if(usuario.getID().equals(pID))
			{  
				return usuario;  
	        }
		}
		return null;
	}	
}

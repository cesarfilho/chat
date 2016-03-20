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
		Usuarios.add(NovoUsuario);
	}

	public ArrayList<UsuarioChat> TodosUsuarios(){	
		  return Usuarios;		  		  
	}		
	
	public void Remover(String pID){
		this.Usuarios.remove(this.getUsuario(pID));
	}
		
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

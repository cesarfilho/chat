package models;
import play.mvc.WebSocket;

public class UsuarioChat {
	private String ID;
	private String Nome;
	private String Imagem;	
	public WebSocket.Out<String> websocket;

	/**
	 * Construtor
	 */	
	public UsuarioChat(String pId, String pusuarioNome,String pusuarioImagem,WebSocket.Out<String> pwebsocket)
	{
		setID(pId);
		setNome(pusuarioNome);	
		setImagem(pusuarioImagem) ;
		setwebsocket(pwebsocket);		
	}
	
	public void Destroy(){
		this.Destroy();
	}

	public String getID() {
		return ID;
	}

	public void setID(String pId) {
		ID = pId;
	}

	public String getNome() {
		return Nome;
	}

	public void setNome(String nome) {
		Nome = nome;
	}

	public String getImagem() {
		return Imagem;
	}

	public void setImagem(String imagem) {
		Imagem = imagem;
	}

	public WebSocket.Out<String> getwebsocket() {
		return websocket;
	}

	public void setwebsocket(WebSocket.Out<String> pwebsocket){
		websocket = pwebsocket;
	}	
}

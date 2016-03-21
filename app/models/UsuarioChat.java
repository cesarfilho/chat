package models;
import play.mvc.WebSocket;

/**
 * @author cesar.pamplona
 *
 */
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

	/**
	 * Metodo retonra ID do Google do Usuario
	 * @return
	 */
	public String getID() {
		return ID;
	}

	/**
	 * MEtodo seta o ID Google do usuario
	 * @param pId
	 */
	public void setID(String pId) {
		ID = pId;
	}

	/**
	 * Metodo retorna o nome do usuario
	 * @return
	 */
	public String getNome() {
		return Nome;
	}

	/**
	 * Metodo seta o nome do usuario
	 * @param nome
	 */
	public void setNome(String nome) {
		Nome = nome;
	}

	/**
	 * Metodo retorna a imagem Google do usuario
	 * @return
	 */
	public String getImagem() {
		return Imagem;
	}

	/**
	 * Metodo seta a imagem Google do usuario
	 * @param imagem
	 */
	public void setImagem(String imagem) {
		Imagem = imagem;
	}

	/**
	 * Metodo retorna a conexao com o websocket do usuario
	 * @return
	 */
	public WebSocket.Out<String> getwebsocket() {
		return websocket;
	}

	/**
	 * MEtodo que define a conexao socket com usuario
	 * @param pwebsocket
	 */
	public void setwebsocket(WebSocket.Out<String> pwebsocket){
		websocket = pwebsocket;
	}	
}

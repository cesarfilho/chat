//local
//var endereco = "http://localhost:9000";
//var wsendereco = "ws://localhost:9000";
//local
var endereco = "https://calm-wildwood-90566.herokuapp.com";
var wsendereco = "wss://calm-wildwood-90566.herokuapp.com";



angular.module('Chat_Web', ['directive.g+signin'])
  .controller('Chat', function ($scope,$http) {
    Conectado(false);
    jQuery("#chatinfo").hide();
    jQuery("#bEntrarSala").hide();
    jQuery("#bSairSala").hide();
    jQuery("#googlesair").hide();
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
      Dados();
  		$scope.$apply();
      jQuery(".abcRioButtonContentWrapper").hide();
      jQuery(".abcRioButton").hide();
      jQuery("#chatinfo").show();
      jQuery("#bEntrarSala").show();
      jQuery("#bSairSala").show();
      jQuery("#googlesair").show();

    });
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      console.log('Não Conectado pelo Google Plus.');
    });
/**
    Método para atualizar os dados do usuario na página de acordo com o login do google.
*/
    function Dados(){
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      $scope.pNome =profile.getName();
      $scope.pImagem =profile.getImageUrl();
      $scope.pID =profile.getId();
      $scope.pEmail =profile.getEmail();

    }
	  $scope.listamensagens  = [];
    $scope.listausuarios = [];
  	$scope.EstaConectado  = false;

    onblur = function(){
      timerfoco = 0;
      focado = false;
      verifica_foco();
    };

    onfocus = function(){
      timerfoco = 0;
      focado = true
    };

    /*
      Metodo para deifinir os metodos dos eventos do websocket.
    */
    $scope.doConnect = function()
  	{
  		websocket.onopen    = function(evt) { $scope.onOpen(evt)    };
  		websocket.onclose   = function(evt) { $scope.onClose(evt)   };
  		websocket.onmessage = function(evt) { $scope.onMessage(evt) };
  	}

/*
    Metodo quando fecha uma conexão com websocket.
*/
  	$scope.onClose = function(evt)
  	{
  		Conectado(false);
  		$scope.listamensagens  = [];
  	}
    /*
        Metodo quando envia ou recebe uma menssagem por uma conexão com websocket.
    */

  	$scope.onMessage = function(evt)
  	{
  		var data = JSON.parse(evt.data);
  		eval('$scope.' + data.evt)(data.msg);
  	}

    /*
        Metodo envia a mensagem para a conexao do websocket.
    */

    $scope.doSend = function(evt, msg)
  	{
  		waitForSocketConnection(websocket, function() {
  		    websocket.send(JSON.stringify({
  											evt: evt,
  											msg: msg
  										   }));
  		});
  	}

    /*
        Metodo abre a conexao com o servidor do websocket.
    */

    $scope.onOpen = function(evt)
  	{
  		$scope.doSend("Entrar",$scope.pID);
  		Conectado(true);

  	}

    /*
        Metodo envia a menssagem que o usuario entrou na sala.
    */

    $scope.entrar_sala = function(){
      var wsUri = wsendereco+"/wslogin/"+$scope.pID+"/"+encodeURIComponent($scope.pNome)+"/"+encodeURIComponent($scope.pImagem);

  		websocket = new WebSocket(wsUri);
  		$scope.doConnect();
  		$scope.onOpen();
	  }

    /*
        Metodo envia amensagem que o usuario saiu da sala,
    */

    $scope.sair_sala = function()
    {
        bInatividade = false;
        var url = endereco+"/logoff"+"/"+encodeURIComponent($scope.pID)+"/"+bInatividade;
        $http.get(url).success( function(data, status, headers, config){
          Conectado(false);
          websocket.close();
        });
    }

    /*
        Metodo envia mesagem que usuario saiu da sala por inatividade.
    */

    $scope.sair_sala_inatividade = function()
    {
      bInatividade = true;
      var url = endereco+"/logoff"+"/"+encodeURIComponent($scope.pID)+"/"+bInatividade;
      $http.get(url).success( function(data, status, headers, config){
        Conectado(false);
        websocket.close();
      });
    }

    /*
        Metodo que atualiza as mensagens que são apresebtadas ao usuario.
    */

    $scope.Chat_SendMsg = function(msg)
  	{
      $scope.listamensagens.push(msg);
      $scope.$apply();
  	}

    /*
        Metodo envia a mensagem do usuario para o websocket.
    */

    $scope.enviarmsg = function()
    {
      msg = JSON.stringify({
                        evt: 'Chat_SendMsg',
                        msg: encodeURIComponent($scope.pNome +' - '+ $scope.mensagem)
                         });

     var url = endereco+"/transmitir"+"/"+msg;

     $http.post(url).success( function(data, status, headers, config){});
     $scope.mensagem ="";
     $scope.apply;
    }
    /*
        Metodo envia mensagem de acao para usuario entrar na sala
    */

  	$scope.Entrar = function(msg)
  	{
  		$scope.Chat_SendMsg(msg);
  	}
    /*
        Metodo envia mensagem de acao para usuario saiu da sala
    */
  	$scope.Sair = function(msg)
  	{
  		$scope.Chat_SendMsg(msg);
  	}

    /*
        Metodo atualiza a lista de usuario logados no chat atualmente
    */

    $scope.AtualizarLogados = function(msg)
  	{
        AtualizarUsuarios(msg);
  	}
    /*
        Metodo recebe lista de usuarios conectados no chat
    */

    function AtualizarUsuarios(servico) {
       var url = endereco+"/"+servico;
       $http.get(url).success( function(data, status, headers, config) {
          $scope.listausuarios = data.listausuarios;
          $scope.apply;
       });
    }
    /*
        Metodo defini se usuario ésta online
    */

    function Conectado(pbConectado)
    {
      $scope.EstaConectado   = pbConectado;
      document.getElementById('bEntrarSala').disabled = pbConectado;
      document.getElementById('bSairSala'  ).disabled = !pbConectado;

    }
    /*
        Metodo verifica se usuario esta inativo ou nao
    */

    function verifica_foco() {
  		timerfoco++;
  		if ((timerfoco == 60) && !(focado))
  		{
  			$scope.sair_sala_inatividade();
  		};
  		if ((!focado) && ($scope.EstaConectado))
  		{
  			setTimeout(verifica_foco, 1000);
  		};
  	};

  });

  function waitForSocketConnection(socket, callback){
    setTimeout(
        function(){
            if (socket.readyState !== null) { if (socket.readyState === 1){
                if(callback !== undefined){
                    callback();
                }
                return;}
            } else {
                waitForSocketConnection(socket,callback);
            }
        }, 5);
  };

  /*
      Metodo finaliza login do Google.
  */

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
  }
  /*
      Metodo remove secao do Google
  */

function googleSignOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      myPostToDeleteMySiteSession() ;
    });
    auth2.disconnect();
  }

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


    $scope.doConnect = function()
  	{
  		websocket.onopen    = function(evt) { $scope.onOpen(evt)    };
  		websocket.onclose   = function(evt) { $scope.onClose(evt)   };
  		websocket.onmessage = function(evt) { $scope.onMessage(evt) };
  	}


  	$scope.onClose = function(evt)
  	{
  		Conectado(false);
  		$scope.listamensagens  = [];
  	}

  	$scope.onMessage = function(evt)
  	{
  		var data = JSON.parse(evt.data);
  		eval('$scope.' + data.evt)(data.msg);
  	}

    $scope.doSend = function(evt, msg)
  	{
  		waitForSocketConnection(websocket, function() {
  		    websocket.send(JSON.stringify({
  											evt: evt,
  											msg: msg
  										   }));
  		});
  	}

    $scope.onOpen = function(evt)
  	{
  		$scope.doSend("Entrar",$scope.pID);
  		Conectado(true);

  	}


    $scope.entrar_sala = function(){
      var wsUri = wsendereco+"/wslogin/"+$scope.pID+"/"+encodeURIComponent($scope.pNome)+"/"+encodeURIComponent($scope.pImagem);

  		websocket = new WebSocket(wsUri);
  		$scope.doConnect();
  		$scope.onOpen();
	  }


    $scope.sair_sala = function()
    {
        bInatividade = false;
        var url = endereco+"/logoff"+"/"+encodeURIComponent($scope.pID)+"/"+bInatividade;
        $http.post(url).success( function(data, status, headers, config){});
        websocket.close();
        AtualizarUsuarios("usuariosconectados");
        Conectado(false);
    }

    $scope.sair_sala_inatividade = function()
    {
      bInatividade = true;
      var url = endereco+"/logoff"+"/"+encodeURIComponent($scope.pID)+"/"+bInatividade;
      $http.post(url).success( function(data, status, headers, config){});
      websocket.close();
      AtualizarUsuarios("usuariosconectados");
      Conectado(false);
    }

    $scope.Chat_SendMsg = function(msg)
  	{
      $scope.listamensagens.push(msg);
      $scope.$apply();
  	}

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

  	$scope.Entrar = function(msg)
  	{
  		$scope.Chat_SendMsg(msg);
  	}

  	$scope.Sair = function(msg)
  	{
  		$scope.Chat_SendMsg(msg);
  	}

    $scope.AtualizarLogados = function(msg)
  	{
        AtualizarUsuarios(msg);
  	}

    function AtualizarUsuarios(servico) {
       var url = endereco+"/"+servico;
       $http.get(url).success( function(data, status, headers, config) {
          $scope.listausuarios = data.listausuarios;
          $scope.apply;
       });
    }

    function Conectado(pbConectado)
    {
      $scope.EstaConectado   = pbConectado;
      document.getElementById('bEntrarSala').disabled = pbConectado;
      document.getElementById('bSairSala'  ).disabled = !pbConectado;

    }

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

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
  }

function googleSignOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      myPostToDeleteMySiteSession() ;
    });
    auth2.disconnect();
  }

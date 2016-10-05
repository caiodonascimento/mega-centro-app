(function(){
  angular
       .module('app')
<<<<<<< HEAD
       .controller('UsuariosController', [ 'usuariosService', '$mdDialog',
            UsuariosController
       ])
       .controller('NuevoUsuarioController', [ '$state', 'usuariosService', 'formatosImputs',
				    '$rootScope',
            NuevoUsuarioController
       ])
       .controller('EditarUsuarioController', [ '$stateParams', '$state', 'usuariosService', 'formatosImputs',
				    '$rootScope',
            EditarUsuarioController
       ]);

  function UsuariosController(usuariosService, $mdDialog) {
    var vm = this;
    vm.openMenu = openMenu;
    vm.deleteUsuarios = deleteUsuarios;
    vm.tableData = [];
    vm.isOpen = false;
    function cargaInicial() {
  	   usuariosService.loadAllUsuarios()
  		 .then(function (usuariosService) {
    	    vm.tableData = usuariosService.data.map(function(usuariosService) {
       		   usuariosService.open = false;
       		   return usuariosService;
    	 		});
  		 });
		}

    var vm = this;
    vm.usersData = [
      {
        id: 1,
        name: 'Caio Medeiros',
        email: 'caio.dona@gmail.com',
        role: {
          name: 'Administrador'
        }
      },
      {
        id: 2,
        name: 'Rodrigo Saldias',
        email: 'rodrigo.saldias@gmail.com',
        role: {
          name: 'Administrador'
        }
=======
       .controller('UsuariosController', [ 'usuariosService', '$mdDialog', 'storageService',
          UsuariosController
       ])
       .controller('NuevoUsuarioController', [ 'usuariosService',
          NuevoUsuarioController
       ])
       .controller('EditarUsuarioController', [ 'usuariosService', '$stateParams', '$rootScope',
          '$state',
          EditarUsuarioController
       ]);

  function UsuariosController(usuariosService, $mdDialog, localStorage) {
    var vm = this;
    vm.openMenu = openMenu;
		vm.deleteUsuario = deleteUsuario;
    vm.usersData = [];
    function cargaInicial() {
      usuariosService.loadAllUsuarios()
      .then(function(resultUsuarios) {
        vm.usersData = resultUsuarios.data;
      }, function(error) {
        console.log(error);
      });
		}
		cargaInicial();
		function openMenu($mdOpenMenu, event) {
			originatorEv = event;
      $mdOpenMenu(event);
		}
		function deleteUsuario(usuario, event) {
      console.log(usuario, localStorage.getObject('currentUser'));
      if (usuario.id === localStorage.getObject('currentUser').id) {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Proceso denegado')
            .textContent('No puedes eliminar al usuario con el que estás autenticado.')
            .ok('Ok')
        );
        return false;
>>>>>>> 0c4f193521227cef223cff14f353258deb43f110
      }
			var confirm = $mdDialog.confirm()
	          .title('Usuarios')
	          .textContent('¿Desea eliminar el usuario ' + usuario.name + ' definitivamente?')
	          .ariaLabel('Lucky day')
	          .targetEvent(event)
	          .ok('Confirmar')
	          .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				usuariosService.deleteUsuario(usuario)
				.then(function() {
					cargaInicial();
					$mdDialog.show(
		      	$mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Eliminando Usuario')
			        .textContent('Usuario ' + usuario.name + ' eliminado con éxito.')
			        .ok('Ok')
		    	);
				});
	    });
		}
  }

  function NuevoUsuarioController(usuariosService) {
    var vm = this;
		vm.createUsuario = createUsuario;
    vm.roles = [
      'Administrador',
      'Contralor',
      'Contador'
    ];
		vm.formUsers = {};
		//vm.formatosImputs = formatosImputs.formUsers;
		vm.usuario = {
      name: '',
      lastName: '',
      photo: '',
      role: '',
      username: '',
      email: '',
      password: '',
      rewritePassword: ''
    };

		function createUsuario() {
			usuariosService.insertUsuario(vm.usuario)
			.then(function() {
				rootScope.$broadcast(
					'event:toastMessage',
					'Usuario registrado con éxito.',
					'md-primary'
				);
				$state.go('home.usuarios', {}, {location: 'replace'});
			});
		}
  }

  function EditarUsuarioController(usuariosService, stateParams, rootScope, state) {
    var vm = this;
    vm.roles = [
      'Administrador',
      'Contralor',
      'Contador'
    ];
    vm.user = {
      name: '',
      lastName: '',
      photo: '',
      role: '',
      username: '',
      email: ''
    };
    vm.handleSubmit = guardarUsuario;
    vm.formUsers = {};
    if (stateParams.id) {
			usuariosService.getById(stateParams.id)
			.then(function(getResult) {
        vm.user = getResult.data;
			});
		} else {
			state.go('home.usuarios');
		}

		function guardarUsuario() {
			usuariosService.updateUsuario(vm.user)
			.then(function(updateResult) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Datos guardados con éxito.',
					'md-primary'
				);
				state.go('home.usuarios');
			})
		}
  }

})();

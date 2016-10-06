(function(){
  angular
       .module('app')
       .controller('UsuariosController', [ 'usuariosService', '$mdDialog',
          'storageService', '$rootScope',
          UsuariosController
       ])
       .controller('NuevoUsuarioController', [ 'usuariosService',
          NuevoUsuarioController
       ])
       .controller('EditarUsuarioController', [ 'usuariosService', '$stateParams', '$rootScope',
          '$state',
          EditarUsuarioController
       ]);

  function UsuariosController(usuariosService, $mdDialog, localStorage, rootScope) {
    var vm = this;
    vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
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
      if (vm.viewAccess.canEdit===1 && vm.viewAccess.canDelete===1) {
        rootScope.$broadcast(
					'event:toastMessage',
					'No tienes acceso, favor comunicarse con el Administrador.',
					'md-alert'
				);
        event.stopPropagation();
        return false;
      }
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

  function NuevoUsuarioController() {
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

  function EditarUsuarioController() {
    var vm = this;

    vm.user = {
      name: '',
      lastName: '',
      photo: '',
      role: '',
      username: '',
      email: ''
    };
  }

})();

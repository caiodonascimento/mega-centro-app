(function(){
  angular
       .module('app')
       .controller('UsuariosController', [ 'usuariosService', '$mdDialog',
          'storageService', '$rootScope',
          UsuariosController
       ])
       .controller('NuevoUsuarioController', [ 'usuariosService', '$rootScope',
          '$state',
          NuevoUsuarioController
       ])
       .controller('EditarUsuarioController', [ 'usuariosService', '$stateParams', '$rootScope',
          '$state',
          EditarUsuarioController
       ]);

  function UsuariosController(usuariosService, $mdDialog, localStorage, rootScope) {
    var vm = this;
    vm.loading = false;
    vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
    vm.openMenu = openMenu;
		vm.deleteUsuario = deleteUsuario;
    vm.usersData = [];
    function cargaInicial() {
      vm.loading = true;
      usuariosService.loadAllUsuarios()
      .then(function(resultUsuarios) {
        vm.usersData = resultUsuarios.data;
        vm.loading = false;
      }, function(error) {
        rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-alert'
				);
        vm.loading = false;
      });
		}
		cargaInicial();
		function openMenu($mdOpenMenu, event) {
      if (vm.viewAccess.canEdit===1 && vm.viewAccess.canDelete===1) {
        rootScope.$broadcast(
					'event:toastMessage',
					'Usted no tienes acceso, favor comunicarse con el Administrador.',
					'md-alert'
				);
        event.stopPropagation();
        return false;
      }
      originatorEv = event;
      $mdOpenMenu(event);
		}
		function deleteUsuario(usuario, event) {
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
      usuario.loading = true;
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
          usuario.loading = false;
				}, function(error) {
          rootScope.$broadcast(
  					'event:toastMessage',
  					'Ha ocurrido un error, favor comunicarse con el Administrador.',
  					'md-alert'
  				);
          usuario.loading = false;
        });
	    }, function() {
        usuario.loading = false;
      });
		}
  }

  function NuevoUsuarioController(usuariosService, rootScope, state) {
    var vm = this;

    vm.loading = false;
		vm.handleSubmit = createUsuario;
    vm.roles = [
      'Administrador',
      'Contralor',
      'Contador'
    ];
		vm.formUsers = {};
		vm.user = {
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
      vm.loading = true;
			usuariosService.insertUsuario(vm.user)
			.then(function() {
				rootScope.$broadcast(
					'event:toastMessage',
					'Usuario registrado con éxito.',
					'md-primary'
				);
				state.go('home.usuarios', {}, {location: 'replace'});
        vm.loading = false;
			}, function(error) {
        rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-primary'
				);
        vm.loading = false;
      });
		}
  }

  function EditarUsuarioController(usuariosService, stateParams, rootScope, state) {
    var vm = this;
    vm.loading = false;
    vm.charge = true;
    vm.user = {
      name: '',
      lastName: '',
      photo: '',
      role: '',
      username: '',
      email: '',
      password: '',
      rewritePassword: ''
    };
    vm.roles = [
      'Administrador',
      'Contralor',
      'Contador'
    ];
    vm.handleSubmit = guardarUsuario;
		vm.formEditar = {};
    vm.changePass = false;

		if (stateParams.id) {
			usuariosService.getById(stateParams.id)
			.then(function(getResult) {
				vm.user = getResult.data;
        vm.charge = false;
			}, function(error) {
        rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-primary'
				);
        state.go('home.usuarios');
        vm.charge = false;
      });
		} else {
			state.go('home.usuarios');
		}

		function guardarUsuario() {
      vm.loading = true;
			usuariosService.updateUsuario(vm.user, vm.changePass)
			.then(function(updateResult) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Datos guardados con éxito.',
					'md-primary'
				);
				state.go('home.usuarios');
        vm.loading = false;
			}, function(error) {
        rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-primary'
				);
        vm.loading = false;
      });
		}
  }

})();

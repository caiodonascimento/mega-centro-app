(function(){
  angular
       .module('app')
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
    cargaInicial();
		function openMenu($mdOpenMenu, event) {
  	   originatorEv = event;
       $mdOpenMenu(event);
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
      }
    ];
  }

  function NuevoUsuarioController() {
    var vm = this;

  }

  function EditarUsuarioController() {
    var vm = this;

    vm.user = {
      id: 1,
      name: 'Caio Medeiros',
      email: 'caio.dona@gmail.com',
      role: {
        name: 'Administrador'
      }
    };
  }

})();

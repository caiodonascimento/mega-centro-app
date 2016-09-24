(function(){

  angular
       .module('app')
       .controller('UsuariosController', [
          UsuariosController
       ])
       .controller('NuevoUsuarioController', [
          NuevoUsuarioController
       ])
       .controller('EditarUsuarioController', [
          EditarUsuarioController
       ]);

  function UsuariosController() {
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

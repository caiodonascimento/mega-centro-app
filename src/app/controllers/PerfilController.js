(function(){

  angular
    .module('app')
    .controller('PerfilController', [ 'storageService',
      PerfilController
    ]);

  function PerfilController(localStorage) {
    var vm = this;

    vm.user = localStorage.getObject('currentUser');
  }

})();

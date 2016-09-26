(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state', '$localStorage', 'formatosImputs',
          'authService',
          LoginController
       ]);

  function LoginController(state, localStorage, formatosImputs, authService) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.validForm = true;
    vm.handleSubmit = makeLogin;
    vm.formatosImputs = formatosImputs.formLogin;

    function makeLogin() {

      localStorage.user = this.formData;
      state.go('home.inicio');
    };
  }

})();

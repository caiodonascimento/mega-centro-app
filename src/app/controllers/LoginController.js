(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state', '$localStorage', 'formatosImputs',
          LoginController
       ]);

  function LoginController(state, localStorage, formatosImputs) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.handleSubmit = makeLogin;
    vm.formatosImputs = formatosImputs.formLogin;

    function makeLogin() {
      localStorage.user = this.formData;
      state.go('home.inicio');
    };
  }

})();

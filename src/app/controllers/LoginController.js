(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state', '$localStorage',
          LoginController
       ]);

  function LoginController(state, localStorage) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.handleSubmit = makeLogin;

    function makeLogin() {
      localStorage.user = this.formData;
      state.go('home.inicio');
    };
  }

})();

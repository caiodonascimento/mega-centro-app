(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state',
          LoginController
       ]);

  function LoginController(state) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.handleSubmit = makeLogin;

    function makeLogin() {
      state.go('home.dashboard');
    };
  }

})();

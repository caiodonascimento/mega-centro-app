(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state', '$localStorage', 'formatosImputs', 'authService',
          LoginController
       ]);

  function LoginController(state, localStorage, formatosImputs, authService) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.handleSubmit = makeLogin;
    vm.formatosImputs = formatosImputs.formLogin;

    function makeLogin() {
      authService.login(vm.formData)
      .then(function(loginResult) {
        localStorage.accessToken = loginResult.data.id;
        authService.getUser(loginResult.data.userId)
        .then(function(getResult) {
          localStorage.user = getResult.data;
          state.go('home.inicio');
        }, function(error) {
          console.log(error);
        });
      }, function(error) {
        console.log(error);
      });
    };
  }

})();

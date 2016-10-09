(function(){

  angular
       .module('app')
       .controller('LoginController', ['$state', 'storageService', 'formatosImputs',
          'authService', '$mdToast', '$scope',
          LoginController
       ]);

  function LoginController(state, localStorage, formatosImputs,
    authService, $mdToast, scope) {
    var vm = this;
    vm.formData = {
      email: '',
      password: '',
    };
    vm.form = {};
    vm.loading = false;
    vm.validForm = true;
    vm.handleSubmit = makeLogin;
    vm.formatosImputs = formatosImputs.formLogin;

    function showResultToast(title, type) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(3500)
          .position('top right')
          .toastClass(type)
      );
    }

    function makeLogin() {
      vm.loading = true;
      authService.login(vm.formData)
      .then(function(loginResult) {
        localStorage.set('accessToken', loginResult.data.id);
        localStorage.setObject('currentUser', loginResult.data.user);
        state.go('home.inicio');
        vm.loading = false;
      }, function(error) {
        vm.loading = false;
        if (error.status === 401) {
          showResultToast('Usuario / contraseña inválidos', 'md-warn');
        }
      });
    };

    scope.$on('event:logout', function() {
      showResultToast('Favor autenticarse primero', 'md-warn');
    })
  }

})();

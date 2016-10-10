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
    vm.errors = {
      email: false
    }
    vm.form = {};
    vm.loading = false;
    vm.handleSubmit = makeLogin;
    vm.formatosImputs = formatosImputs.formLogin;
    var regexEmail = new RegExp(vm.formatosImputs.email.format);

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
      vm.errors.email = !regexEmail.test(vm.formData.email);
      if (vm.errors.email) {
        return false;
      }
      vm.loading = true;
      authService.login(vm.formData)
      .then(function(loginResult) {
        console.log(loginResult);
        if (loginResult.status === 401) {
          showResultToast('Usuario / contraseña inválidos', 'md-warn');
        } else {
          localStorage.set('accessToken', loginResult.data.id);
          localStorage.setObject('currentUser', loginResult.data.user);
          state.go('home.inicio');
        }
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

    scope.$watch('vm.formData.email', function(newValue, oldValue) {
      if (!vm.form.$submitted) {
        return false;
      }
      if (newValue === undefined || !_.isString(newValue)) {
        return false;
      }
      if (newValue === "") {
        return false;
      }
      vm.errors.email = !regexEmail.test(vm.formData.email);
    });
  }

})();

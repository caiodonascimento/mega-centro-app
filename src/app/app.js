(function(){
  'use strict';

  angular.module('app', [ 'ngMaterial' ])
  .run(function($rootScope, authService, $state) {

    $rootScope.$on('$stateChangeStart',
    function(event, toState){
      if (toState.name !== 'login') {
        if (!authService.verifyUser()) {
          authService.logout();
          event.preventDefault();
          $state.go('login', {}, {location: 'replace'});
          $rootScope.$broadcast('event:logout');
        }
      }
    });
  });

})();

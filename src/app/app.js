(function(){
  'use strict';

  angular.module('app', [ 'ngMaterial' ])
  .run(function($rootScope, storageService, authService, $state) {
    $rootScope.$on('$stateChangeStart',
      function(event, toState){
        if (toState.name !== 'login') {
          if (!authService.verifyUser()) {
            event.preventDefault();
            $rootScope.$broadcast('event:start-logout');
          }
        }
      }
    );
    $rootScope.$on('event:start-logout',
      function(event) {
        authService.logout();
        $state.go('login', {}, {location: 'replace'});
        $rootScope.$broadcast('event:logout');
      }
    );
  });
})();

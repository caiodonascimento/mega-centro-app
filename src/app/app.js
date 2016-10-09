(function(){
  'use strict';

  angular.module('app', [ 'ngMaterial' ])
  .run(function($rootScope, storageService, authService, $state, Idle) {
    $rootScope.$on('$stateChangeStart',
      function(event, toState){
        if (toState.name !== 'login') {
          if (!authService.verifyUser()) {
            event.preventDefault();
            $rootScope.$broadcast('event:start-logout');
          } else {
            if (!Idle.running()) {
              Idle.watch();
            }
          }
        }
      }
    );
    $rootScope.$on('event:start-logout',
      function(event) {
        if ($state.current.name !== 'login') {
          authService.logout();
          $state.go('login', {}, {location: 'replace'});
          $rootScope.$broadcast('event:logout');
        }
      }
    );
    $rootScope.$on('IdleTimeout', function() {
      $rootScope.$broadcast('event:start-logout');
    });
  });
})();

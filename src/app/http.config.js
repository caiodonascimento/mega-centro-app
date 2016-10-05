(function(){
  'use strict';

  angular.module('app')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope, storageService) {
      return {
        'request': function(config) {
          var accessToken = storageService.get('accessToken')
          if (accessToken) {
            config.headers.Authorization = accessToken;
          }
          return config;
        },
        'responseError': function(response) {
          if (response.status === 401) {
            $rootScope.$broadcast('event:start-logout');
          }
          return response;
        }
      };
    });
  });
})();

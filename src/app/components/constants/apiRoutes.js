(function(){
  'use strict';
  var hostServer = 'http://megacentroapi-mosschile.rhcloud.com/api'
  angular.module('app')
    .constant('apiRoutes', {
      usuarios: {
        login: '/users/login',
        logout: '/users/logout',
        create: '/users',
        find: '/users/'
      }
    });
})();

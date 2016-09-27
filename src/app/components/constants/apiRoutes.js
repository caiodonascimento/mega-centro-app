(function(){
  'use strict';
  var hostServer = 'http://megacentroapi-mosschile.rhcloud.com/api'
  angular.module('app')
    .constant('apiRoutes', {
      usuarios: hostServer + '/users',
      empresas: hostServer + '/enterprises',
      chileanAccount: hostServer + '/chileanAccount'
    });
})();
(function(){
  'use strict';
  var hostServer = 'https://megacentroapi-mosschile.rhcloud.com/api'
  angular.module('app')
    .constant('apiRoutes', {
      usuarios: hostServer + '/users',
      empresas: hostServer + '/enterprises',
      chileanAccounts: hostServer + '/chileanAccounts',
      originAccounts: hostServer + '/originAccounts',
      accountTransactions: hostServer + '/accountTransactions'
    });
})();

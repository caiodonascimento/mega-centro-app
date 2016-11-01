(function(){
  'use strict';
  var hostServer = 'https://megacentroapi-mosschile.rhcloud.com/api';//'http://localhost:8081/api';
  angular.module('app')
    .constant('apiRoutes', {
      usuarios: hostServer + '/users',
      empresas: hostServer + '/enterprises',
      chileanAccounts: hostServer + '/chileanAccounts',
      originAccounts: hostServer + '/originAccounts',
      accountTransactions: hostServer + '/accountTransactions',
      chargeTransactions: hostServer + '/chargeTransactions',
      levels: hostServer + '/levels'
    });
})();

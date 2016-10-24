(function(){
  'use strict';
  var hostServer = 'http://localhost:3000/api';//'https://megacentroapi-mosschile.rhcloud.com/api';
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

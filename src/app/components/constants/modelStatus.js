(function(){
  'use strict';
  var hostServer = 'http://megacentroapi-mosschile.rhcloud.com/api'
  angular.module('app')
    .constant('modelStatus', [
      {
        id: 0,
        value: 'Activo'
      },
      {
        id: 1,
        value: 'Eliminado'
      }
    ]);
})();

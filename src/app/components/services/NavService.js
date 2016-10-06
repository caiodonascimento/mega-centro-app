(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q', '$http', 'apiRoutes',
          navService
  ]);

  function navService($q, $http, apiRoutes){
    return {
      loadAllItems : function() {
        var deferred = $q.defer();
        $http.get(
          apiRoutes.usuarios + '/menu'
        ).then(function(response) {
          var menuItems = response.data.menuItems.filter(function(menuItem) {
            return menuItem.menuDetail.length > 0;
          });
          deferred.resolve(menuItems);
        }, function(error) {
          deferred.reject([]);
        });
        return deferred.promise;
      }
    };
  }

})();

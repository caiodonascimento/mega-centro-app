(function(){
    'use strict';

    angular.module('app')
        .service('movimientoService', [
            'apiRoutes', '$http', '$q',
            movimientoService
        ]);

    function movimientoService(apiRoutes, $http, $q) {
        return {
            getAllThen: function(enterpriseId, year) {
                return $q.when(
                    $http.get(
                        apiRoutes.accountTransactions + '/getAll' ,
                        {
                          params: {
                            'enterpriseId': enterpriseId,
                            'year': year
                          }
                        }
                    )
                );
            }
        };
    }
})();

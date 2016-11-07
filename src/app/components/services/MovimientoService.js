(function(){
    'use strict';

    angular.module('app')
        .service('movimientoService', [
            'apiRoutes', '$http', '$q',
            movimientoService
        ]);

    function movimientoService(apiRoutes, $http, $q) {
        return {
            getAllThen: function() {
                return $q.when(
                    $http.post(
                        apiRoutes.chargeTransactions,
                        data
                    )
                );
            }
        };
    }
})();

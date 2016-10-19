(function(){
    'use strict';

    angular.module('app')
        .service('cargaService', [
            'apiRoutes', '$http', '$q',
            cargaService
        ]);

    function cargaService(apiRoutes, $http, $q) {
        return {
            generateHeader: function(header) {
                var data = {
                    "year": header.year,
                    "month": header.month,
                    "status": 0,
                    "createDate": new Date(),
                    "enterpriseId": header.enterprise.id
                };
                return $q.when(
                    $http.post(
                        apiRoutes.chargeTransactions,
                        data
                    )
                );
            },
            saveAccountTransaction: function(accountTransaction) {

            }
        };
    }
})();

(function(){
    'use strict';

    angular.module('app')
        .service('movimientoService', [
            'apiRoutes', '$http', '$q',
            movimientoService
        ]);

    function movimientoService(apiRoutes, $http, $q) {
        return {
          deleteByIds: function(ids) {
            var params = {
              ids: ids
            };
            return $q.when(
              $http.post(
                apiRoutes.accountTransactions + '/deleteByIds' ,
                params
              )
            );
          },
          updateByIds: function(data, ids) {
            var params = {
              chargeId: {
                inq: ids
              }
            };
            return $q.when(
              $http.post(
                apiRoutes.accountTransactions + '/update',
                data,
                {
                  params: params
                }
              )
            );
          },
          getAllThen: function(enterpriseId, year, month) {
            var params = {
              'enterpriseId': enterpriseId,
              'year': year
            };
            if (month) {
              params.month = month;
            }
            return $q.when(
              $http.get(
                apiRoutes.accountTransactions + '/getAll' ,
                {
                  params: params
                }
              )
            );
          }
        };
    }
})();

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
            var deferred = $q.defer();
            if (ids.length === 1) {
              var params = {
                'where[id]': ids[0].toString()
              };
              $http.post(
                apiRoutes.accountTransactions + '/update',
                data,
                {
                  params: params
                }
              ).then(function(response) {
                if (response.status === 200) {
                  deferred.resolve(response.data);
                } else {
                  deferred.reject({});
                }
              }, function(error) {
                deferred.reject({});
              });
            } else if (ids.length === 0) {
              deferred.reject({});
            } else {
              var params = '?where[id][inq]='
              _.each(ids, function(id, index) {
                params = params + id.toString() + ids.length === index+1 ? ''
                  : '&where[id][inq]=';
              });
              console.log(params);
              $http.post(
                apiRoutes.accountTransactions + '/update' + params,
                data
              ).then(function(response) {
                if (response.status === 200) {
                  deferred.resolve(response.data);
                } else {
                  deferred.reject({});
                }
              }, function(error) {
                deferred.reject({});
              });
            }
            return deferred.promise;
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

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
              var params = {
                ids: ids,
                data: data
              };
              $http.post(
                apiRoutes.accountTransactions + '/updateByIds',
                params
              ).then(function(response) {
                console.log(response);
                if (response.status === 200) {
                  deferred.resolve(response.data.result);
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
          },
          getBalance: function(enterpriseId, year, month) {
            var params = {
              'enterpriseId': enterpriseId,
              'year': year,
              'month': month
            };
            return $q.when(
              $http.get(
                apiRoutes.chargeTransactions + '/getBalance',
                {
                  params: params
                }
              )
            );
          },
          getBalanceEvolutivo: function(enterpriseId, year) {
            var params = {
              'enterpriseId': enterpriseId,
              'year': year
            };
            return $q.when(
              $http.get(
                apiRoutes.chargeTransactions + '/getBalanceEvolutivo',
                {
                  params: params
                }
              )
            );
          },
          getTransactionsWithChileanAccount: function(enterpriseId, year, month) {
            var deferred = $q.defer();
            var params = {
              'filter[where][enterpriseId]': enterpriseId,
              'filter[where][year]': year
            };
            $http.get(
              apiRoutes.chargeTransactions,
              {
                params: params
              }
            ).then(function(response) {
              console.log(response);
              if (response.status === 200) {
                if (response.data.length === 0) {
                  deferred.resolve([]);
                } else {
                  params = {
                    'filter[include][originAccount]': 'chileanAccount',
                    'filter[where][chargeId]': response.data[0].id
                  };
                  $http.get(
                    apiRoutes.accountTransactions,
                    {
                      params: params
                    }
                  ).then(function(resultado) {
                    console.log(resultado);
                    if (resultado.status === 200) {
                      var datos = _.filter(resultado.data, function(value) {
                        value.Date = new Date(value.date);
                        return month ? (value.Date.getMonth() + 1) === parseInt(month) : true;
                      });
                      deferred.resolve(datos);
                    } else {
                      deferred.reject([]);
                    }
                  }, function(error) {
                    deferred.reject([]);
                  });
                }
              } else {
                deferred.reject([]);
              }
            }, function(error) {
              deferred.reject([]);
            });
            return deferred.promise;
          }
        };
    }
})();

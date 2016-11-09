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
                    "status": 0,
                    "createDate": new Date(),
                    "year": header.year,
                    "enterpriseId": header.empresa.id,
                    "userId": header.user.id
                };
                return $q.when(
                    $http.post(
                        apiRoutes.chargeTransactions,
                        data
                    )
                );
            },
            saveAccountTransaction: function(accountTransactions, chargeId) {
                var arrayProcess = [];
                _.forEach(accountTransactions, function(value) {
                    var data = {
                        "date": value.Date,
                        "num": value.Num,
                        "name": value.Name,
                        "memo": value.Memo,
                        "account": value.Account,
                        "split": value.Split,
                        "amount": value.Amount,
                        "tc": value.TC,
                        "liabilities": value['Pesos Liabilities'],
                        "status": 0,
                        "createDate": new Date(),
                        "chargeId": chargeId,
                        "originAccountId": value.originAccountId
                    };
                    arrayProcess.push($q.when(
                        $http.post(
                            apiRoutes.accountTransactions,
                            data
                        )
                    ));
                });
                return $q.all(arrayProcess);
            },
            finishCharge: function(id) {
              var data = {
                  "status": 0
              };
              return $q.when(
                $http.put(
                  apiRoutes.chargeTransactions + '/' + id.toString(),
                  data
                )
              );
            },
            cancelCharge: function(id) {
              return $q.when(
                $http.delete(
                  apiRoutes.chargeTransactions + '/' + id.toString()
                )
              );
            }
        };
    }
})();

(function(){
	'use strict';

	angular.module('app')
        .service('planCtaOriginService', [
        '$q', '$http', 'apiRoutes', 'planCtaChileService',
        planCtaOriginService
	]);

	function planCtaOriginService($q, $http, apiRoutes, planCtaChileService) {
		return {
			loadAllPlanCtaOrigin : function(cuentaDestino) {
				return $q.when(
					$http.get(
						apiRoutes.originAccounts,
						{
							params: {
								'filter[where][and][0][chileanAccountId]': cuentaDestino,
								'filter[where][and][1][status]': 0,
								'filter[include]': 'chileanAccount'
							}
						}
					)
				);
			},
			insertPlanCtaOrigin : function(planCtaOrigin) {
				var now = new Date();
				var data = {
                	account: planCtaOrigin.account,
					name: planCtaOrigin.name,
                	status: 0,
            		createDate: new Date(),
            		chileanAccountId: planCtaOrigin.chileanAccountId
				};
				return $q.when(
					$http.post(
						apiRoutes.originAccounts,
						data
					)
				);
			},
			updatePlanCtaOrigin : function(planCtaOrigin) {
				var data = {
					account: planCtaOrigin.account,
					name: planCtaOrigin.name,
					chileanAccountId: planCtaOrigin.chileanAccountId
				};
				return $q.when(
					$http.put(
						apiRoutes.originAccounts + '/' + planCtaOrigin.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						apiRoutes.originAccounts + '/' + id,
						{
							params: {
								//'filter[include]': 'chileanAccount',
								'filter[include][chileanAccount]': 'enterprise'
							}
						}
					)
				);
			},
			getByEmpresaId: function(empresaId) {
				var deferred = $q.defer();
				planCtaChileService.loadAllPlanCtaChile({
					id: empresaId
				}).then(function(respuesta) {
					if (respuesta.status !== 200) {
						deferred.reject([]);
						return false;
					}
					var listadoCuentasChile = respuesta.data;
					var idsCuentaChile = _.pluck(listadoCuentasChile, 'id');
					console.log(idsCuentaChile);
					if (idsCuentaChile.length === 1 ){
						$http.get(
							apiRoutes.originAccounts,
							{
								params: {
									'filter[include]': 'chileanAccount',
									'filter[where][chileanAccountId]': idsCuentaChile[0],
									'filter[where][status]': 0
								}
							}
						).then(function(response) {
							console.log(response);
							if (response.status === 200) {
								deferred.resolve(response.data);
							} else {
								deferred.reject([]);
							}
						}, function(error) {
							deferred.reject([]);
						});
					} else if (idsCuentaChile.length > 1) {
						var params = '?filter[include]=chileanAccount&filter[where][chileanAccountId][inq]=';
						_.each(idsCuentaChile, function(id, index) {
							params = params + id.toString() + (idsCuentaChile.length === index + 1 ? ''
								: '&filter[where][chileanAccountId][inq]=');
						});
						$http.get(
							apiRoutes.originAccounts + params
						).then(function(response) {
							if (response.status === 200) {
								deferred.resolve(response.data);
							} else {
								deferred.reject([]);
							}
						}, function(error) {
							deferred.reject([]);
						});
					} else {
						deferred.resolve([]);
					}
				}, function(error) {
					deferred.reject([]);
				});
				return deferred.promise;
			},
			deletePlanCtaOrigin : function(planCtaOrigin) {
				var data = {
					status: 1
				};
				return $q.when(
					$http.put(
						apiRoutes.originAccounts + '/' + planCtaOrigin.id.toString(),
						data
					)
				);
			},
			findManyByAccount : function(listAccounts) {
				var deferred = $q.defer();
				if (listAccounts.length === 0) {
					deferred.resolve([]);
				} else if (listAccounts.length === 1) {
					$http.get(
						apiRoutes.originAccounts,
						{
							params: {
								'filter[where][account]': listAccounts[0],
								'filter[include]': 'chileanAccount'
							}
						}
					).then(function(response) {
						if (response.status === 200) {
							deferred.resolve(response.data);
						} else {
							deferred.reject([]);
						}
					});
				} else {
					var params = '?filter[include]=chileanAccount&filter[where][account][inq]=';
					_.each(listAccounts, function(account, index) {
						console.log(account, index);
						params = params + account + (listAccounts.length === index + 1 ? ''
							: '&filter[where][account][inq]=');
					});
					console.log(apiRoutes.originAccounts + params);
					$http.get(
						apiRoutes.originAccounts + params
					).then(function(response) {
						if (response.status === 200) {
							deferred.resolve(response.data);
						} else {
							deferred.reject([]);
						}
					});
				}
				return deferred.promise;
			}
		};
	}
})();

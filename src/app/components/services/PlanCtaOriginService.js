(function(){
	'use strict';

	angular.module('app')
        .service('planCtaOriginService', [
        '$q', '$http', 'apiRoutes',
        planCtaOriginService
	]);

	function planCtaOriginService($q, $http, apiRoutes) {
			return {
					loadAllPlanCtaOrigin : function(cuentaDestino) {
							return $q.when(
									$http.get(
											apiRoutes.originAccounts,
											{
												params: {
													'filter[where][and][0][chileanAccountId]': cuentaDestino.id,
													'filter[where][and][1][status]': 0
												}
											}
									)
							);
					},
					insertPlanCtaOrigin : function(planCtaChile) {
							var now = new Date();
							var data = {
                account: planCtaOrigin.account,
  				  		name: planCtaOrigin.name,
                status: 0,
            		createDate: new Date(),
            		chileanAccountId: planCtaOrigin.chileanAccount.id
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
          		createDate: new Date(),
          		chileanAccountId: planCtaOrigin.chileanAccount.id
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
									apiRoutes.originAccounts + '/' + id
							)
						);
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
					}
			};
	}
})();

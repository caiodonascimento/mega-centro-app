(function(){
	'use strict';

	angular.module('app')
        .service('planCtaChileService', [
        '$q', '$http', 'apiRoutes',
        planCtaChileService
	]);

	function planCtaChileService($q, $http, apiRoutes) {
			return {
					loadAllPlanCtaChile : function(empresa) {
							console.log(empresa);
							return $q.when(
									$http.get(
											apiRoutes.chileanAccounts,
											{
												params: {
													'filter[where][and][0][enterpriseId]': empresa.id,
													'filter[where][and][1][status]': 0
												}
											}
									)
							);
					},
					insertPlanCtaChile : function(planCtaChile) {
							var now = new Date();
							var data = {
								account: planCtaChile.account,
								name: planCtaChile.name,
								level1: planCtaChile.level1,
								level2: planCtaChile.level2,
								level3: planCtaChile.level3,
								status: 0,
								createDate: now.toString(),
								enterpriseId: planCtaChile.enterpriseId
							};
							return $q.when(
								$http.post(
										apiRoutes.chileanAccounts,
										data
								)
							);
					},
					updatePlanCtaChile : function(planCtaChile) {
						var data = {
          		account: planCtaChile.account,
				  		name: planCtaChile.name,
          		level1: planCtaChile.level1,
          		level2: planCtaChile.level2,
          		level3: planCtaChile.level3
						};
						return $q.when(
							$http.put(
								apiRoutes.chileanAccounts + '/' + planCtaChile.id.toString(),
								data
							)
						);
					},
					getById : function(id) {
						return $q.when(
							$http.get(
									apiRoutes.chileanAccounts + '/' + id
							)
						);
					},
					deletePlanCtaChile : function(planCtaChile) {
						var data = {
							status: 1
						};
						return $q.when(
							$http.put(
								apiRoutes.chileanAccounts + '/' + planCtaChile.id.toString(),
								data
							)
						);
					},
					findLikeName : function(text) {
						return $q.when(
							$http.get(
								apiRoutes.chileanAccounts,
								{
									params: {
										'filter[where][and][0][name][like]': text + '%',
										'filter[where][and][1][status]': 0
									}
								}
							)
						);
					}
			};
	}
})();

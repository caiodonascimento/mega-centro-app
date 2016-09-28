(function(){
	'use strict';

	angular.module('app')
        .service('planCtaChileService', [
        '$q', '$http', 'apiRoutes',
        planCtaChileService
	]);

	function planCtaChileService($q, $http, apiRoutes) {
			return {
					loadAllPlanCtaChile : function() {
							return $q.when(
									$http.get(
											apiRoutes.chileanAccount,
											{
												params: {
														'filter[where][status]': 'active'
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
									status: "active",
									createDate: now.toString()
							};
							return $q.when(
									$http.post(
											apiRoutes.chileanAccount,
											data
									)
							);
					},
					updateEmpresa: function(planCtaChile) {
							var data = {
		          		account: planCtaChile.account,
						  		name: planCtaChile.name,
		          		level1: planCtaChile.level1,
		          		level2: planCtaChile.level2,
		          		level3: planCtaChile.level3
							};
							return $q.when(
									$http.put(
											apiRoutes.chileanAccount + '/' + planCtaChile.id.toString(),
											data
									)
							);
					},
					getById : function(id) {
							return $q.when(
									$http.get(
											apiRoutes.chileanAccount + '/' + id
									)
							);
					},
					deletePlanCtaChile : function(planCtaChile) {
							var data = {
									status: 'eliminada'
							};
							return $q.when(
									$http.put(
											apiRoutes.chileanAccount + '/' + planCtaChile.id.toString(),
											data
									)
							);
					},
					findLikeName: function(text) {
							return $q.when(
									$http.get(
											apiRoutes.chileanAccount,
											{
													params: {
															'filter[where][and][0][name][like]': text + '%',
															'filter[where][and][1][status]': 'active'
													}
											}
									)
							);
					}
			};
	}
})();

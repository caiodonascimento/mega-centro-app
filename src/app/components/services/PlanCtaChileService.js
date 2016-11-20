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
				return $q.when(
					$http.get(
						apiRoutes.chileanAccounts,
						{
							params: {
								'filter[include]': 'enterprise',
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
					level3: '',
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
					level1: planCtaChile.level1.name || planCtaChile.level1,
					level2: planCtaChile.level2.name || planCtaChile.level2,
					level3: ''
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
						apiRoutes.chileanAccounts + '/' + id,
						{
							params: {
								'filter[include]': 'enterprise'
							}
						}
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
			},
			findByIds: function(ids) {
				var deferred = $q.defer();
				if (ids.length === 1) {
					$http.get(
						apiRoutes.chileanAccounts,
						{
							params: {
								'filter[where][id]': ids[0]
							}
						}
					).then(function(response) {
						if (response.status === 200) {
							deferred.resolve(response.data);
						} else {
							deferred.reject([]);
						}
					});
				} else if (ids.length === 0) {
					deferred.reject([]);
				} else {
					var params = '?filter[where][id][inq]=';
					_.each(ids, function(id, index) {
						params = params + id.toString() + (ids.length === index + 1 ? ''
							: '&filter[where][id][inq]=');
					});
					$http.get(
						apiRoutes.chileanAccounts + params
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

(function(){
	'use strict';

	angular.module('app')
        .service('planCtaChileService', [
        '$q', '$http',
        planCtaChileService
	]);

	function planCtaChileService($q, $http) {
		return {
			loadAllPlanCtaChile : function() {
				return $q.when(
					$http.get('https://megacentroapi-mosschile.rhcloud.com/api/chileanAccount')
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
						'https://megacentroapi-mosschile.rhcloud.com/api/chileanAccount',
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
						'https://megacentroapi-mosschile.rhcloud.com/api/chileanAccount/' + planCtaChile.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						'https://megacentroapi-mosschile.rhcloud.com/api/chileanAccount/' + id
					)
				);
			},
			deletePlanCtaChile : function(planCtaChile) {
			}
		};
	}
})();

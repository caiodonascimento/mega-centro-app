(function(){
	'use strict';

	angular.module('app')
        .service('levelsService', [
        '$q', '$http', 'apiRoutes',
        levelsService
	]);

	function levelsService($q, $http, apiRoutes) {
		return {
			loadAllLevels : function() {
				return $q.when(
					$http.get(
						apiRoutes.levels,
						{
							params: {
								'filter[where][status]': 0
							}
						}
					)
				);
			},
			insertLevels : function(level) {
				var now = new Date();
				var data = {
					name: level.name,
				  description: level.description,
          type: level.type,
				  status: 0,
				  createDate: now.toString()
				};
				return $q.when(
					$http.post(
						apiRoutes.levels,
						data
					)
				);
			},
			updateLevel: function(level) {
				var data = {
          name: level.name,
				  description: level.description,
          type: level.type,
				};
				return $q.when(
					$http.put(
						apiRoutes.levels + '/' + level.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						apiRoutes.levels + '/' + id
					)
				);
			},
			deleteLevel : function(level) {
				var data = {
					status: 1
				};
				return $q.when(
					$http.put(
						apiRoutes.levels + '/' + level.id.toString(),
						data
					)
				);
			},
			findLikeName: function(text) {
				return $q.when(
					$http.get(
						apiRoutes.levels,
						{
							params: {
								'filter[where][and][0][name][like]': text + '%',
								'filter[where][and][1][status]': 0
							}
						}
					)
				);
			},
      findByTypeAndName: function(name, level) {
      	return $q.when(
        	$http.get(
          	apiRoutes.levels,
            {
            	params: {
                      	'filter[where][and][0][name][like]': name + '%',
                        'filter[where][and][1][type]': level,
                        'filter[where][and][2][status]': 0
              }
            }
          )
        );
      }
		};
	}
})();

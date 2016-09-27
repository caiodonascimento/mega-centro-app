(function(){
	'use strict';

	angular.module('app')
        .service('empresasService', [
        '$q', '$http', 'apiRoutes',
        empresasService
	]);

	function empresasService($q, $http, apiRoutes) {
		return {
			loadAllEmpresas : function() {
				return $q.when(
					$http.get(
						apiRoutes.empresas,
						{
							params: {
								'filter[where][status]': 'active'
							}
						}
					)
				);
			},
			insertEmpresas : function(empresa) {
				var now = new Date();
				var data = {
					name: empresa.name,
				  code: empresa.code,
				  status: "active",
				  createDate: now.toString()
				};
				return $q.when(
					$http.post(
						apiRoutes.empresas,
						data
					)
				);
			},
			updateEmpresa: function(empresa) {
				var data = {
					name: empresa.name,
				  code: empresa.code
				};
				return $q.when(
					$http.put(
						apiRoutes.empresas + '/' + empresa.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						apiRoutes.empresas + '/' + id
					)
				);
			},
			deleteEmpresa : function(empresa) {
				var data = {
					status: 'eliminada'
				};
				return $q.when(
					$http.put(
						apiRoutes.empresas + '/' + empresa.id.toString(),
						data
					)
				);
			},
			findLikeName: function(text) {
				return $q.when(
					$http.get(
						apiRoutes.empresas,
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

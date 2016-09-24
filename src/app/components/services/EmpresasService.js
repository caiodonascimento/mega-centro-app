(function(){
	'use strict';

	angular.module('app')
        .service('empresasService', [
        '$q',
				'$http',
        empresasService
	]);

	function empresasService($q, $http) {
		return {
			loadAllEmpresas : function() {
				return $q.when(
					$http.get('https://megacentroapi-mosschile.rhcloud.com/api/enterprises')
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
						'https://megacentroapi-mosschile.rhcloud.com/api/enterprises',
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
						'https://megacentroapi-mosschile.rhcloud.com/api/enterprises/' + empresa.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						'https://megacentroapi-mosschile.rhcloud.com/api/enterprises/' + id
					)
				);
			}
		};
	}
})();

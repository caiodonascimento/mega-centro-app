(function(){
	'use strict';

	angular.module('app')
        .service('empresasService', [
        '$q',
        empresasService
	]);

	function empresasService($q) {
		var empresas = [];

		return {
			loadAllEmpresas : function() {
				return $q.when(empresas);
			},
			insertEmpresas : function(empresa) {
				empresa.id = empresas.length + 1;
				empresas.push(empresa);
			},
			getOneById : function(id) {
				console.log(parseInt(id), empresas);
				return $q.when(_.findWhere(empresas, {'id': parseInt(id)}));
			},
			saveEmpresa : function(empresa) {
				var deferred = $q.defer();
				var oldEmpresa = _.findWhere(empresas, {'id': empresa.id});
				if (!oldEmpresa) {
					deferred.reject({});
				} else {
					var index = _.indexOf(empresas, oldEmpresa);
					empresas[index] = empresa;
					deferred.resolve(empresa);
				}
				return deferred.promise;
			}
		};
	}	
})();
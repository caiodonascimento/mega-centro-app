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
			deleteEmpresa : function(empresa) {
				
			}
		};
	}
})();

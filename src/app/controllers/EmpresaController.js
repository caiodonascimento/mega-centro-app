(function(){
	angular
		.module('app')
		.controller('EmpresaController', [ 'empresasService',
			EmpresaController
		])
		.controller('NuevaEmpresaController', [ '$state', 'empresasService',
			NuevaEmpresaController
		])
		.controller('EditarEmpresaController', [
          EditarEmpresaController
		]);

	function EmpresaController(empresasService) {
		var vm = this;

		empresasService.loadAllEmpresas()
		.then(function (empresas) {
			vm.tableData = empresas;
		});
	}

	function NuevaEmpresaController($state, empresasService) {
		var vm = this;
		vm.createEmpresa = createEmpresa;
		
		vm.empresa = { 
			name: '', 
			codeSoftalnd: ''
		};
		
		function createEmpresa() {
			console.log(vm.empresa);
			empresasService.insertEmpresas(vm.empresa);
			$state.go('home.empresas');
		}
	}
	
	function EditarEmpresaController() {
		var vm = this;

	}

})();

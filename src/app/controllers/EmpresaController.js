(function(){
	angular
		.module('app')
		.controller('EmpresaController', [ 'empresasService',
			EmpresaController
		])
		.controller('NuevaEmpresaController', [ '$state', 'empresasService',
			NuevaEmpresaController
		])
		.controller('EditarEmpresaController', [ '$stateParams', 'empresasService', '$state',
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

		vm.formEmpresa = {};
		vm.formatoInputs = {
			name: '^[A-Za-z\\d\\s]+$'
		};
		vm.empresa = {
			name: '',
			code: ''
		};

		function createEmpresa() {
			empresasService.insertEmpresas(vm.empresa);
			$state.go('home.empresas');
		}
	}

	function EditarEmpresaController($stateParams, empresasService, $state) {
		var vm = this;
		vm.guardarEmpresa = guardarEmpresa;

		vm.empresa = {
			name: '',
			code: ''
		};
		console.log($stateParams.id)
		if ($stateParams.id) {
			empresasService.getOneById($stateParams.id)
			.then(function (empresa) {
				console.log(empresa);
				vm.empresa = empresa;
			}, function(error) {
				console.log('No exito al guardar', error);
			});
		} else {
			$state.go('home.empresas');
		}
		
		function guardarEmpresa() {
			console.log('Inicia guardado');
			empresasService.saveEmpresa(vm.empresa)
			.then(function (empresa) {
				console.log('Exito al guardar', empresa);
				$state.go('home.empresas');
			}, function(error) {
				console.log('No exito al guardar', error);
			});
		}
	}

})();

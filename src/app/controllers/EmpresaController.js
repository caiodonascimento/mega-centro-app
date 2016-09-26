(function(){
	angular
		.module('app')
		.controller('EmpresaController', [ 'empresasService',
			EmpresaController
		])
		.controller('NuevaEmpresaController', [ '$state', 'empresasService', '$rootScope',
			NuevaEmpresaController
		])
		.controller('EditarEmpresaController', [ '$stateParams', '$state', 'empresasService',
			'$rootScope',
			 EditarEmpresaController
		]);

	function EmpresaController(empresasService) {
		var vm = this;
		vm.tableData = [];
		function cargaInicial() {
			empresasService.loadAllEmpresas()
			.then(function (empresas) {
				vm.tableData = empresas.data;
			});
		}
		cargaInicial();
	}

	function NuevaEmpresaController($state, empresasService, rootScope) {
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
			empresasService.insertEmpresas(vm.empresa)
			.then(function() {
				console.log('Exito');
				rootScope.$broadcast(
					'event:toastMessage',
					'Empresa registrada con éxito.',
					'md-primary'
				);
				$state.go('home.empresas', {}, {location: 'replace'});
			});
		}
	}

  function EditarEmpresaController(stateParams, state, empresasService, rootScope) {
    var vm = this;
		vm.empresa = {
			name: '',
			code: ''
		};
		vm.handleSubmit = guardarEmpresa;
		vm.form = {};

		if (stateParams.id) {
			empresasService.getById(stateParams.id)
			.then(function(getResult) {
				vm.empresa = getResult.data;
			});
		} else {
			state.go('home.empresas');
		}

		function guardarEmpresa() {
			empresasService.updateEmpresa(vm.empresa)
			.then(function(updateResult) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Datos guardados con éxito.',
					'md-primary'
				);
				state.go('home.empresas');
			})
		}
  }

})();

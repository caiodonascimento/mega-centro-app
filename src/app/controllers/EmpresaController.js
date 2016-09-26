(function(){
	angular
		.module('app')
		.controller('EmpresaController', [ 'empresasService',
				EmpresaController
		])
		.controller('NuevaEmpresaController', [ '$state', 'empresasService', 'formatosImputs',
				'$rootScope',
				NuevaEmpresaController
		])
		.controller('EditarEmpresaController', [ '$stateParams', '$state', 'empresasService', 'formatosImputs',
				'$rootScope',
				EditarEmpresaController
		])
		.controller('EliminarEmpresaController', [ '$stateParams',
				EliminarEmpresaController
		]);

	function EmpresaController(empresasService) {
		var vm = this;
		vm.tableData = [];
		vm.isOpen = false;
		function cargaInicial() {
			empresasService.loadAllEmpresas()
			.then(function (empresas) {
				vm.tableData = empresas.data.map(function(empresa) {
					empresa.open = false;
					return empresa;
				});
			});
		}
		cargaInicial();
	}

	function NuevaEmpresaController($state, empresasService, formatosImputs, rootScope) {
		var vm = this;
		vm.createEmpresa = createEmpresa;

		vm.formEmpresa = {};
		vm.formatosImputs = formatosImputs.formEmpresa;
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

  function EditarEmpresaController(stateParams, state, empresasService, formatosImputs, rootScope) {
    var vm = this;
		//Agregando codigo para probar las validaciones.
		vm.formatosImputs = formatosImputs.formEditar;
		vm.empresa = {
			name: '',
			code: ''
		};
		vm.handleSubmit = guardarEmpresa;
		vm.formEditar = {};

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

	function EliminarEmpresaController(stateParams) {
		var vm = this;
		vm.empresa = {
			name: '',
			code: ''
		};
		vm.formEmpresa = {};

		function quitarEmpresa() {
			//Cambiar el estado de la empresa a Inactivo.
		}
	}

})();

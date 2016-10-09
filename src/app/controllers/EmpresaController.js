(function(){
	angular
		.module('app')
		.controller('EmpresaController', [ 'empresasService', '$mdDialog',
			'$rootScope', 'storageService',
			EmpresaController
		])
		.controller('NuevaEmpresaController', [ '$state', 'empresasService', 'formatosImputs',
			'$rootScope',
			NuevaEmpresaController
		])
		.controller('EditarEmpresaController', [ '$stateParams', '$state', 'empresasService', 'formatosImputs',
			'$rootScope',
			EditarEmpresaController
		]);

	function EmpresaController(empresasService, $mdDialog, rootScope, localStorage) {
		var vm = this;
		vm.loading = false;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.openMenu = openMenu;
		vm.deleteEmpresa = deleteEmpresa;
		vm.tableData = [];
		vm.isOpen = false;
		function cargaInicial() {
			vm.loading = true;
			empresasService.loadAllEmpresas()
			.then(function (empresas) {
				vm.tableData = empresas.data;
				vm.loading = false;
			}, function(error) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-alert'
				);
				vm.loading = false;
			});
		}
		cargaInicial();
		function openMenu($mdOpenMenu, event) {
			if (vm.viewAccess.canEdit===1 && vm.viewAccess.canDelete===1) {
				rootScope.$broadcast(
					'event:toastMessage',
					'No tienes acceso, favor comunicarse con el Administrador.',
					'md-alert'
				);
				event.stopPropagation();
				return false;
      }
			originatorEv = event;
      $mdOpenMenu(event);
		}
		function deleteEmpresa(empresa, event) {
			empresa.loading = true;
			var confirm = $mdDialog.confirm()
        .title('Empresas')
        .textContent('¿Desea eliminar la empresa ' + empresa.name + ' definitivamente?')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Confirmar')
        .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				empresasService.deleteEmpresa(empresa)
				.then(function() {
					cargaInicial();
					$mdDialog.show(
		      	$mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Eliminando Empresa')
			        .textContent('Empresa ' + empresa.name + ' eliminada con éxito.')
			        .ok('Ok')
		    	);
					empresa.loading = false;
				}, function(error) {
					rootScope.$broadcast(
						'event:toastMessage',
						'Ha ocurrido un error, favor comunicarse con el Administrador.',
						'md-alert'
					);
					empresa.loading = false;
				});
	    }, function() {
				empresa.loading = false;
			});
		}
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
				rootScope.$broadcast(
					'event:toastMessage',
					'Empresa registrada con éxito.',
					'md-primary'
				);
				$state.go('home.empresas', {}, {location: 'replace'});
			}, function(error) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un problema, favor vuelva a intentarlo.',
					'md-primary'
				);
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

})();

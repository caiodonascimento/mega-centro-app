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
		vm.openMenu = openMenu;
		vm.delete = delete;
		empresasService.loadAllEmpresas()
		.then(function (empresas) {
			vm.tableData = empresas;
		});
		function openMenu($mdOpenMenu, event) {
			originatorEv = event;
      $mdOpenMenu(event);
		}
		function delete(empresa, event) {
			var confirm = $mdDialog.confirm()
	          .title('Empresas')
	          .textContent('¿Desea eliminar la empresa ' + empresa.name + ' definitivamente?')
	          .ariaLabel('Lucky day')
	          .targetEvent(event)
	          .ok('Confirmar')
	          .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				empresasService.deleteEmpresa(empresa);
				
	    });
		}
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

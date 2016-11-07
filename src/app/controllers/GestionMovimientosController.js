(function(){
	angular
  	.module('app')
  	.controller('GestionMovimientosController', [
			'$stateParams', '$state', 'movimientoService', 'storageService', '$rootScope',
  		GestionMovimientosController
  	]);
  function GestionMovimientosController(stateParams, state, movimientoService, localStorage, rootScope) {
		var vm = this;
		vm.searchProcess = true;
		vm.query = {
      order: 'Date',
      limit: 10,
      page: 1
    };
		vm.arrayResults = [];
		vm.selected = [];
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		function init() {
			movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year)
			.then(function(response) {
				vm.arrayResults = response.data.accountTransactions;
				console.log(vm.arrayResults);
				vm.searchProcess = false;
			});
		}
		console.log(stateParams.idEmpresa, stateParams.year, stateParams.month);
		if (stateParams.idEmpresa && stateParams.year) {
			init();
		} else {
			state.go('home.gestion-movimientos', {}, {location: 'replace'});
		}
		vm.getResults = getResults;
		function getResults() {

		}
		vm.showState = showState;
		function showState(state) {
			switch (state) {
				case 0:
					return 'Cargado';
					break;
				case 1:
					return 'Eliminado';
					break;
				case 2:
					return 'Autorizado';
					break;
				default:
					return 'Desconocido';
			}
		}
		vm.openMenu = openMenu;
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
  }
})();

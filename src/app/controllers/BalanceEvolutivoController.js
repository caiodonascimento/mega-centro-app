(function(){
	angular
  	.module('app')
		.controller('BalanceController', [
			'storageService', 'movimientoService', '$stateParams', '$state', '$mdDialog',
  		BalanceController
  	])
		.controller('BalanceEvolutivoController', [
			'storageService', 'movimientoService', '$stateParams', '$state',
  		BalanceEvolutivoController
  	]);
  function BalanceEvolutivoController(localStorage, movimientoService, stateParams, state) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		function init() {
			vm.loading = true;
			vm.arrayData = [];
			movimientoService.getBalanceEvolutivo(vm.empresa, vm.year)
			.then(function(response) {
				if (response.status === 200) {
					vm.arrayData = response.data.balance;
				}
				vm.loading = false;
			});
		}
		if (stateParams.idEmpresa && stateParams.year) {
			vm.empresa = stateParams.idEmpresa;
			vm.year = stateParams.year;
			init();
		} else {
			state.go('home.balance-ev', {}, {location: 'replace'});
		}
		vm.volver = volver;
		function volver() {
			state.go('home.balance-ev', {
				empresa: stateParams.idEmpresa,
				year: stateParams.year
			});
		}
  }

	function BalanceController(localStorage, movimientoService, stateParams, state, $mdDialog) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		vm.arrayData = [];
		function init() {
			vm.loading = true;
			vm.arrayData = [];
			movimientoService.getBalance(vm.empresa, vm.year, vm.month)
			.then(function(response) {
				if (response.status === 200) {
					vm.arrayData = response.data.balance;
				}
				vm.loading = false;
			});
		}
		if (stateParams.idEmpresa && stateParams.year && stateParams.month) {
			vm.empresa = stateParams.idEmpresa;
			vm.year = stateParams.year;
			vm.month = stateParams.month;
			init();
		} else {
			state.go('home.balance', {}, {location: 'replace'});
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
		vm.volver = volver;
		function volver() {
			state.go('home.balance', {
				empresa: stateParams.idEmpresa,
				year: stateParams.year,
				month: stateParams.month
			});
		}
  }
})();

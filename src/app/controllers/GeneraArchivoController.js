(function(){
	angular
  	.module('app')
  	.controller('GeneraArchivoController', [
			'movimientoService', '$stateParams', '$state',
  		GeneraArchivoController
  	]);
  function GeneraArchivoController(movimientoService, stateParams, state) {
		var vm = this;
		vm.loading = true;
		vm.arrayData = [];
		function init() {
			movimientoService.getTransactionsWithChileanAccount(vm.empresa, vm.year, vm.month)
			.then(function(result) {
				vm.arrayData = result;
				vm.loading = false;
			})
		}
		if (stateParams.idEmpresa && stateParams.year) {
			vm.empresa = stateParams.idEmpresa;
			vm.year = stateParams.year;
			vm.month = stateParams.month;
			init();
		} else {
			state.go('home.genera-archivo', {}, {location: 'replace'});
		}
		vm.volver = volver;
		function volver() {
			state.go('home.genera-archivo', {
				empresa: stateParams.idEmpresa,
				year: stateParams.year,
				month: stateParams.month
			});
		}
		vm.download = download;
		function download() {
			
		}
  }
})();

(function(){
	angular
  	.module('app')
  	.controller('BuscarCargaController', [
			'commonService', '$q', 'empresasService', '$state',
			BuscarCargaController
  	]);
  function BuscarCargaController(commonService, $q, empresasService, state) {
		var vm = this;

		vm.months = commonService.getMonths();
		vm.years = commonService.getYears();
		vm.searchForm = {};
		vm.loading = false;
		vm.search = {
			empresa: null,
			year: null,
			month: null
		};
		vm.redirectTo = 'home.inicio';
		vm.searchText = null;

		if (state.current.name === 'home.gestion-movimientos') {
			vm.redirectTo = 'home.gestion-movimientos-data';
		} else if (state.current.name === 'home.balance-ev') {
			vm.redirectTo = 'home.balance-ev-data';
		} else if (state.current.name === 'home.genera-archivo') {
			vm.redirectTo = 'home.genera-archivo-data';
		} else {
			state.go(vm.redirectTo, {}, {location: 'replace'});
		}

		vm.querySearchEmpresa = querySearchEmpresa;
		function querySearchEmpresa(query) {
			var defer = $q.defer();
      empresasService.findLikeName(query)
      .then(function (response) {
        defer.resolve(response.data);
      }, function (error) {
        defer.reject([]);
      });
      return defer.promise;
		}

		vm.handleSubmit = buscarCargas;
		function buscarCargas() {
			state.go(vm.redirectTo, {
				idEmpresa: vm.search.empresa.id,
				year: vm.search.year,
				month: vm.search.month
			});
		}
  }
})();

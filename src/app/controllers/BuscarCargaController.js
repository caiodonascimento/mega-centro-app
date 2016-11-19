(function(){
	angular
  	.module('app')
  	.controller('BuscarCargaController', [
			'commonService', '$q', 'empresasService', '$state', '$stateParams',
			BuscarCargaController
  	]);
  function BuscarCargaController(commonService, $q, empresasService, state, stateParams) {
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

		if (state.current.name === 'home.gestion-movimientos') {
			vm.redirectTo = 'home.gestion-movimientos-data';
		} else if (state.current.name === 'home.balance') {
			vm.redirectTo = 'home.balance-data';
		} else if (state.current.name === 'home.balance-ev') {
			vm.redirectTo = 'home.balance-ev-data';
		} else if (state.current.name === 'home.genera-archivo') {
			vm.redirectTo = 'home.genera-archivo-data';
		} else {
			state.go(vm.redirectTo, {}, {location: 'replace'});
		}

		if (stateParams.empresa) {
			empresasService.getById(stateParams.empresa)
			.then(function(response) {
				if (response.status === 200) {
					vm.search.empresa = response.data.id;
				}
			});
		}

		if (stateParams.year) {
			vm.search.year = parseInt(stateParams.year);
		}

		if (stateParams.month) {
			vm.search.month = parseInt(stateParams.month);
		}

		function querySearchEmpresa(query) {
			var defer = $q.defer();
			empresasService.loadAllEmpresas()
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
				idEmpresa: vm.search.empresa,
				year: vm.search.year,
				month: vm.search.month
			});
		}

		querySearchEmpresa().then(function(empresas) {
			vm.empresas = empresas;
			vm.loading = false;
		})
  }
})();

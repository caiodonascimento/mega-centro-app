(function(){
    angular
        .module('app')
        .controller('SearchAccountController', [
            '$stateParams', '$state', 'empresasService', '$q', '$scope', 'planCtaChileService',
            SearchAccountController
        ]);

    function SearchAccountController(stateParams, state, empresasService, $q, $scope, planCtaChileService) {
        var vm = this;
        vm.empresa = null;
        vm.viewSearch = '';
        vm.loading = true;
        vm.searchForm = {};
        vm.chileanAccounts = [];

        if (state.current.name === 'home.plan-chile') {
          vm.viewSearch = 'chilean';
        } else if (state.current.name === 'home.plan-origen') {
          vm.viewSearch = 'origin';
        } else {
          state.go('home.inicio');
        }

        if (stateParams.idEmpresa) {
          empresasService.getById(stateParams.idEmpresa)
          .then(function(result) {
            vm.empresa = result.data.id;
          });
        }

        vm.filterAccounts = filterAccounts;

        function querySearchEmpresa() {
          var defer = $q.defer();
          empresasService.loadAllEmpresas()
          .then(function (response) {
            defer.resolve(response.data);
          }, function (error) {
              defer.reject([]);
          });
          return defer.promise;
        }

        function filterAccounts() {
          if (state.current.name === 'home.plan-chile') {
              state.go('home.plan-chile-data', {idEmpresa: vm.empresa});
          }
          if (state.current.name === 'home.plan-origen') {
              state.go('home.plan-origen-data', {idEmpresa: vm.empresa});
          }
        }

        querySearchEmpresa().then(function(empresas) {
          vm.empresas = empresas;
          vm.loading = false;
        })
    }

})();

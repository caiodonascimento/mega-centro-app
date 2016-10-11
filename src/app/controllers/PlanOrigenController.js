(function(){

    angular
        .module('app')
        .controller('PlanOrigenController', [
          '$q', 'empresasService', '$scope', 'planCtaChileService', 'planCtaOriginService', 'storageService',
          PlanOrigenController
        ])
        .controller('PlanOrigenNuevoController', [
          PlanOrigenNuevoController
        ])
        .controller('PlanOrigenEditarController', [
          PlanOrigenEditarController
        ]);

    function PlanOrigenController($q, empresasService, $scope, planCtaChileService, planCtaOriginService, localStorage) {
        var vm = this;

        vm.chileanAccounts = [];
        vm.searchForm = {};
        vm.searchText = null;
        vm.empresa = null;
        vm.cuenta = null;
        vm.querySearchEmpresa = querySearchEmpresa;
        vm.searchProcess = false;
        vm.filterAccounts = filterAccounts;
        vm.loading = false;
        vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
        vm.errors = {
          cuenta: false
        };
        vm.cuentasOrigin = [];

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

        function filterAccounts() {
          if (vm.searchForm.$valid) {
            vm.searchProcess = true;
            vm.loading = true;
            planCtaOriginService.loadAllPlanCtaOrigin(vm.cuenta)
            .then(function(result) {
              console.log(result);
              vm.cuentasOrigin = result.data;
              vm.loading = false;
            });
          }
        }

        function chargeAccounts(newValue) {
          if (newValue === null) {
            vm.errors.cuenta = false;
            vm.cuenta = null;
            vm.chileanAccounts = [];
          } else {
            vm.loading = true;
            planCtaChileService.loadAllPlanCtaChile(newValue)
            .then(function(result) {
              vm.chileanAccounts = result.data;
              if (vm.chileanAccounts.length === 0) {
                vm.errors.cuenta = true;
              } else {
                vm.errors.cuenta = false;
              }
              vm.loading = false;
            });
          }
        }

        $scope.$watch('vm.empresa', chargeAccounts);
    }

    function PlanOrigenNuevoController() {
      var vm = this;

    }

    function PlanOrigenEditarController() {
      var vm = this;

    }

})();

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
        vm.cuenta = null;
        vm.viewSearch = '';
        vm.loading = false;
        vm.searchFormChilean = {};
        vm.searchFormOrigin = {};
        vm.chileanAccounts = [];
        vm.errors = {
            cuenta: false
        };
        vm.searchText = null;
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
                vm.empresa = result.data;
            });
        }

        vm.filterAccounts = filterAccounts;
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

        function filterAccounts() {
            if (state.current.name === 'home.plan-chile') {
                state.go('home.plan-chile-data', {idEmpresa: vm.empresa.id});
            }
            if (state.current.name === 'home.plan-origen') {
                state.go('home.plan-origen-data', {idCuenta: vm.cuenta});
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

})();

(function(){

    angular
        .module('app')
        .controller('PlanOrigenController', [
            'planCtaChileService', 'planCtaOriginService', 'storageService', '$stateParams', '$state',
            PlanOrigenController
        ])
        .controller('PlanOrigenNuevoController', [
            'planCtaChileService', '$stateParams', '$state',
            PlanOrigenNuevoController
        ])
        .controller('PlanOrigenEditarController', [
          PlanOrigenEditarController
        ]);

    function PlanOrigenController(planCtaChileService, planCtaOriginService, localStorage, stateParams, state) {
        var vm = this;
        vm.chileanAccountId = '';
        vm.empresa = null;
        vm.loading = false;
        vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
        vm.cuentasOrigin = [];

        function init() {
            vm.loading = true;
            planCtaOriginService.loadAllPlanCtaOrigin(vm.chileanAccountId)
            .then(function(result) {
              console.log(result);
              vm.cuentasOrigin = result.data;
              vm.loading = false;
            });
        }
        if (stateParams.idCuenta) {
            vm.chileanAccountId = stateParams.idCuenta;
            planCtaChileService.getById(vm.chileanAccountId)
            .then(function(resultAccount) {
                vm.empresa = resultAccount.data.enterprise;
            });
            init();
        } else {
            state.go('home.plan-origen');
        }
    }

    function PlanOrigenNuevoController(planCtaChileService, stateParams, state) {
        var vm = this;
        if (stateParams.idCuenta) {
            vm.chileanAccountId = stateParams.idCuenta;
            planCtaChileService.getById(vm.chileanAccountId)
            .then(function(resultAccount) {
                vm.empresa = resultAccount.data.enterprise;
            });
        } else {
            state.go('home.plan-origen');
        }
        vm.createPlanCtaOrigin = createPlanCtaOrigin;
        function createPlanCtaOrigin() {

        }
    }

    function PlanOrigenEditarController() {
        var vm = this;

        function init() {

        }
        if (stateParams.idCuentaOrigen) {
            vm.chileanAccountId = stateParams.idCuentaOrigen;
            init();
        } else {
            state.go('home.plan-origen');
        }
    }

})();

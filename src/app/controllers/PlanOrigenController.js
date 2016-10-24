(function(){

    angular
        .module('app')
        .controller('PlanOrigenController', [
            'planCtaChileService', 'planCtaOriginService', 'storageService', '$stateParams', '$state', '$mdDialog', '$rootScope',
            PlanOrigenController
        ])
        .controller('PlanOrigenNuevoController', [
            'planCtaChileService', '$stateParams', '$state', 'planCtaOriginService',
            PlanOrigenNuevoController
        ])
        .controller('PlanOrigenEditarController', [
          PlanOrigenEditarController
        ]);

    function PlanOrigenController(planCtaChileService, planCtaOriginService, localStorage, stateParams, state, $mdDialog, rootScope) {
        var vm = this;
        vm.chileanAccountId = '';
        vm.empresa = null;
        vm.loading = false;
        vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
        vm.cuentasOrigin = [];
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

        vm.deleteCuenta = deleteCuenta;
        function deleteCuenta(cuenta, event) {
            cuenta.loading = true;
            var confirm = $mdDialog.confirm()
                .title('Plan de Cuentas Origen')
                .textContent('¿Desea eliminar la cuenta ' + cuenta.name + ' definitivamente?')
                .ariaLabel('Lucky day')
                .targetEvent(event)
                .ok('Confirmar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                    planCtaOriginService.deletePlanCtaOrigin(cuenta)
                        .then(function() {
                            init();
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Eliminando cuenta')
                                    .textContent('Cuenta ' + empresa.name + ' eliminada con éxito.')
                                    .ok('Ok')
                            );
                            cuenta.loading = false;
                        },
                        function(error) {
                            rootScope.$broadcast(
                                'event:toastMessage',
                                'Ha ocurrido un error, favor comunicarse con el Administrador.',
                                'md-alert'
                            );
                            cuenta.loading = false;
                        });
                }, function() {
                    cuenta.loading = false;
                });
        }

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

    function PlanOrigenNuevoController(planCtaChileService, stateParams, state, planCtaOrigenService) {
        var vm = this;

        vm.planCtaOrigen = {
            account: '',
            name: ''
        };
        vm.loading = false;
        if (stateParams.idCuenta) {
            vm.chileanAccountId = stateParams.idCuenta;
            planCtaChileService.getById(vm.chileanAccountId)
            .then(function(resultAccount) {
                vm.cuenta = resultAccount.data;
                vm.empresa = resultAccount.data.enterprise;
            });
        } else {
            state.go('home.plan-origen');
        }
        vm.createPlanCtaOrigin = createPlanCtaOrigin;
        function createPlanCtaOrigin() {
            vm.loading = true;
            vm.planCtaOrigen.chileanAccountId = vm.chileanAccountId;
            planCtaOrigenService.insertPlanCtaOrigin(vm.planCtaOrigen)
                .then(function(response) {
                    vm.loading = true;
                    state.go('home.plan-origen-data', {idCuenta: vm.chileanAccountId});
                });
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

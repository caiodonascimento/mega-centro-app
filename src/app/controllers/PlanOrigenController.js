(function(){
    angular
        .module('app')
        .controller('PlanOrigenController', [ 'planCtaOriginService', '$mdDialog',
            '$rootScope', 'storageService', 'planCtaChileService', 'empresasService',
            '$stateParams', '$state',
            PlanOrigenController
        ])
        .controller('PlanOrigenNuevoController', [ '$state', 'planCtaChileService', 'formatosImputs',
            '$rootScope', '$stateParams', 'planCtaOriginService', 'empresasService',
            PlanOrigenNuevoController
        ])
        .controller('PlanOrigenEditarController', [ '$stateParams', '$state', 'planCtaChileService', 'formatosImputs',
            '$rootScope', 'planCtaOriginService',
            PlanOrigenEditarController
        ]);

    function PlanOrigenController(planCtaOriginService, $mdDialog, rootScope, localStorage,
    planCtaChileService, empresasService, stateParams, state) {
        var vm = this;
        vm.loading = false;
        vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
        vm.openMenu = openMenu;
        vm.deleteCuenta = deleteCuenta;
        vm.cuentasOrigin = [];
        vm.empresa = null;
        vm.chileanAccountId = '';
        function init() {
          vm.loading = true;
          planCtaOriginService.getByEmpresaId(vm.empresaId)
          .then(function(result) {
            vm.cuentasOrigin = result;
            vm.loading = false;
          });
        }
        if (stateParams.idEmpresa) {
          vm.empresaId = stateParams.idEmpresa;
          empresasService.getById(vm.empresaId)
          .then(function(resultAccount) {
              vm.empresa = resultAccount.data;
          });
          init();
        } else {
          state.go('home.plan-origen');
        }
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
                      .title('Eliminando Plan Cta Origen')
                      .textContent('Cuenta ' + cuenta.name + ' eliminada con éxito.')
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
    }

    function PlanOrigenNuevoController(state, planCtaChileService, formatosImputs, rootScope,
    stateParams, planCtaOrigenService, empresasService) {
        var vm = this;
        vm.loading = false;
        vm.planCtaOrigen = {
          account: '',
          name: ''
        };
        vm.cuenta = {};
        if (stateParams.idEmpresa) {
          vm.empresaId = stateParams.idEmpresa;
          empresasService.getById(vm.empresaId)
          .then(function(resultAccount) {
            vm.empresa = resultAccount.data;
          });
          planCtaChileService.loadAllPlanCtaChile({
            id: vm.empresaId
          })
          .then(function(response) {
            vm.cuentas = response.data;
          })
        } else {
          state.go('home.plan-origen');
        }
        vm.formPlanOrigen = {};
        vm.formatosImputs = formatosImputs.formPlanOrigen;
        vm.createPlanCtaOrigin = createPlanCtaOrigin;
        function createPlanCtaOrigin() {
          vm.loading = true;
          vm.planCtaOrigen.chileanAccountId = vm.cuenta.id;
          planCtaOrigenService.insertPlanCtaOrigin(vm.planCtaOrigen)
          .then(function(response) {
            rootScope.$broadcast(
              'event:toastMessage',
              'Plan Cta. de Origen registrada con éxito.',
              'md-primary'
            );
            state.go('home.plan-origen-data', {idEmpresa: vm.empresaId});
            vm.loading = false;
          }, function(error) {
            rootScope.$broadcast(
              'event:toastMessage',
              'Ha ocurrido un problema, favor vuelva a intentarlo.',
              'md-primary'
            );
            vm.loading = false;
          });
        }
    }

    function PlanOrigenEditarController(stateParams, state, planCtaChileService, formatosImputs,
    rootScope, planCtaOriginService) {
        var vm = this;
        vm.loading = false;
        vm.charge = true;
        vm.formPlanOrigen = {};
        vm.formatosImputs = formatosImputs.formPlanOrigen;
        vm.handleSubmit = guardarPlanCtaOrigin;
        function guardarPlanCtaOrigin() {
          vm.loading = true;
          planCtaOriginService.updatePlanCtaOrigin(vm.planCtaOrigin)
          .then(function(response) {
            vm.loading = false;
            rootScope.$broadcast(
              'event:toastMessage',
              'Datos guardados con éxito.',
              'md-primary'
            );
            state.go('home.plan-origen-data', {idEmpresa: vm.planCtaOrigin.chileanAccount.enterprise.id});
            vm.loading = false;
          }, function(error) {
            rootScope.$broadcast(
              'event:toastMessage',
              'Ha ocurrido un error, favor comunicarse con el Administrador.',
              'md-primary'
            );
            vm.loading = false;
          });
        }
        function init() {
          planCtaOriginService.getById(vm.chileanAccountId)
          .then(function(response) {
            vm.planCtaOrigin = response.data;
            planCtaChileService.loadAllPlanCtaChile({
              id: vm.planCtaOrigin.chileanAccount.enterprise.id.toString()
            })
            .then(function(response) {
              vm.cuentas = response.data;
            })
          });
        }
        if (stateParams.idCuentaOrigen) {
          vm.chileanAccountId = stateParams.idCuentaOrigen;
          init();
          vm.charge = false;
        } else {
          state.go('home.plan-origen');
        }
    }

})();

(function(){
  angular
    .module('app')
    .controller('PlanChileController', [ 'planCtaChileService', '$mdDialog',
      '$rootScope', 'storageService', '$q', 'empresasService', '$stateParams',
      PlanChileController
    ])
    .controller('NuevoPlanChileController', [ '$state', 'planCtaChileService', 'formatosImputs',
      '$rootScope', '$stateParams', 'empresasService', 'levelsService', '$q',
      NuevoPlanChileController
    ])
    .controller('EditarPlanChileController', [ '$stateParams', '$state', 'planCtaChileService', 'formatosImputs',
      '$rootScope', 'empresasService', 'levelsService', '$q',
      EditarPlanChileController
    ]);

  function PlanChileController(planCtaChileService, $mdDialog, rootScope, localStorage, $q,
  empresasService, $stateParams) {
    var vm = this;
    vm.loading = false;
    vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
    vm.openMenu = openMenu;
    vm.deletePlanCtaChile = deletePlanCtaChile;
    vm.tableData = [];
    vm.isOpen = false;
    vm.empresa = null;
    function cargaInicial() {
      vm.loading = true;
      planCtaChileService.loadAllPlanCtaChile({
        id: parseInt(vm.idEmpresa)
      })
      .then(function (planCtaChile) {
        vm.tableData = planCtaChile.data.map(function(plan) {
          plan.open = false;
          return plan;
        });
        vm.loading = false;
      },
      function(error) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Ha ocurrido un error, favor comunicarse con el Administrador.',
          'md-alert'
        );
        vm.loading = false;
      });
    }
    if ($stateParams.idEmpresa) {
      vm.idEmpresa = $stateParams.idEmpresa;
      empresasService.getById(vm.idEmpresa)
      .then(function(result) {
        vm.empresa = result.data;
      });
      cargaInicial();
    } else {
      state.go('home.plan-chile');
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
    function deletePlanCtaChile(planCtaChile, event) {
      planCtaChile.loading = true;
      var confirm = $mdDialog.confirm()
        .title('PlanesCtaChile')
        .textContent('¿Desea eliminar el Plan Cta de Chile ' + planCtaChile.name + ' definitivamente?')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Confirmar')
        .cancel('Cancelar');
      $mdDialog.show(confirm).then(function() {
        planCtaChileService.deletePlanCtaChile(planCtaChile)
        .then(function() {
          cargaInicial();
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Eliminando Plan Cta de Chile')
              .textContent('Plan Cta de Chile ' + planCtaChile.name + ' eliminada con éxito.')
              .ok('Ok')
          );
          planCtaChile.loading = false;
        }, function(error) {
          rootScope.$broadcast(
              'event:toastMessage',
              'Ha ocurrido un error, favor comunicarse con el administrador.',
              'md-alert'
          );
          planCtaChile.loading = false;
        });
      }, function() {
        planCtaChile.loading = false;
      });
    }
  }

  function NuevoPlanChileController($state, planCtaChileService, formatosImputs, rootScope, $stateParams,
    empresasService, levelsService, $q) {
    var vm = this;
    vm.loading = false;
    vm.createPlanCtaChile = createPlanCtaChile;
    vm.empresa = null;
    vm.levels1 = [];
    vm.levels2 = [];
    if ($stateParams.idEmpresa) {
      vm.idEmpresa = $stateParams.idEmpresa;
      empresasService.getById(vm.idEmpresa)
      .then(function(result) {
        vm.empresa = result.data;
      });
    } else {
      $state.go('home.plan-chile');
    }
  	vm.formPlanChile = {};
  	vm.formatosImputs = formatosImputs.formPlanChile;
  	vm.planCtaChile = {};
    function createPlanCtaChile() {
      vm.loading = true;
      vm.planCtaChile.enterpriseId = vm.empresa.id;
      planCtaChileService.insertPlanCtaChile(vm.planCtaChile)
      .then(function() {
        rootScope.$broadcast(
          'event:toastMessage',
          'Plan Cta. de Chile registrada con éxito.',
          'md-primary'
        );
        $state.go('home.plan-chile-data', {idEmpresa: vm.idEmpresa}, {location: 'replace'});
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

    function querySearchNiveles(searchText, levelType) {
      var deferred = $q.defer();
      levelsService.findByTypeAndName(searchText, levelType)
      .then(function (result) {
        deferred.resolve(result.data);
      });
      return deferred.promise;
    }

    querySearchNiveles('', '1').then(function(response) {
      vm.levels1 = response;
    });

    querySearchNiveles('', '2').then(function(response) {
      vm.levels2 = response;
    });
  }

  function EditarPlanChileController(stateParams, state, planCtaChileService, formatosImputs, rootScope,
    empresasService, levelsService, $q) {
    var vm = this;
    vm.loading = false;
    vm.charge = true;
    vm.empresa = null;
    vm.levels1 = [];
    vm.levels2 = [];
    vm.formatosImputs = formatosImputs.formPlanChile;
    vm.planCtaChile = {};
    vm.handleSubmit = guardarPlanCtaChile;
    vm.formPlanChile = {};
    if (stateParams.id) {
      planCtaChileService.getById(stateParams.id)
      .then(function(getResult) {
        vm.planCtaChile = getResult.data;
        if (vm.planCtaChile.enterpriseId) {
          vm.idEmpresa = vm.planCtaChile.enterpriseId;
          empresasService.getById(vm.idEmpresa)
          .then(function(result) {
            vm.empresa = result.data;
            vm.charge = false;
          });
        } else {
          state.go('home.plan-chile');
        }
      }, function(error) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Ha ocurrido un error, favor comunicarse con el Administrador.',
          'md-primary'
        );
        state.go('home.plan-chile');
        vm.charge = false;
      });
    } else {
      state.go('home.plan-chile');
    }
    function guardarPlanCtaChile() {
      vm.loading = true;
      planCtaChileService.updatePlanCtaChile(vm.planCtaChile)
      .then(function(updateResult) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Datos guardados con éxito.',
          'md-primary'
        );
        state.go('home.plan-chile-data', {idEmpresa: vm.idEmpresa}, {location: 'replace'});
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

    function querySearchNiveles(searchText, levelType) {
      var deferred = $q.defer();
      levelsService.findByTypeAndName(searchText, levelType)
      .then(function (result) {
        deferred.resolve(result.data);
      });
      return deferred.promise;
    }

    querySearchNiveles('', '1').then(function(response) {
      vm.levels1 = response;
    });

    querySearchNiveles('', '2').then(function(response) {
      vm.levels2 = response;
    });
  }
})();

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
			    '$rootScope',
          EditarPlanChileController
       ]);
   function PlanChileController(planCtaChileService, $mdDialog, rootScope, localStorage, $q, empresasService, $stateParams) {
      var vm = this;
      vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		  vm.openMenu = openMenu;
		  vm.deletePlanCtaChile = deletePlanCtaChile;
		  vm.tableData = [];
		  vm.isOpen = false;
          vm.empresa = null;
		  function cargaInicial() {
			  planCtaChileService.loadAllPlanCtaChile({
                id: parseInt(vm.idEmpresa)
              })
			  .then(function (planCtaChile) {
          console.log(planCtaChile);
          vm.tableData = planCtaChile.data.map(function(plan) {
				    plan.open = false;
				    return plan;
          });
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
        });
      });
    }
	}

  function NuevoPlanChileController($state, planCtaChileService, formatosImputs, rootScope, $stateParams, empresasService, levelsService, $q) {
		  var vm = this;
		  vm.createPlanCtaChile = createPlanCtaChile;
        vm.empresa = null;
        vm.searchText1 = '';
        vm.searchText2 = '';
        console.log($stateParams.idEmpresa);
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
  		vm.planCtaChile = {
          account: '',
            name: '',
            level1: '',
            level2: '',
            level3: ''
  		};

  		function createPlanCtaChile() {
            vm.planCtaChile.enterpriseId = vm.empresa.id;
    			planCtaChileService.insertPlanCtaChile(vm.planCtaChile)
    			.then(function() {
    				  console.log('Exito');
    				  rootScope.$broadcast(
    					    'event:toastMessage',
        					'Plan Cta. de Chile registrada con éxito.',
        					'md-primary'
    				  );
    				  $state.go('home.plan-chile-data', {idEmpresa: vm.idEmpresa}, {location: 'replace'});
    			});
  		}

        vm.querySearchNiveles = querySearchNiveles;
        function querySearchNiveles(searchText, levelType) {
            var deferred = $q.defer();
            levelsService.findByTypeAndName(searchText, levelType)
            .then(function (result) {
                console.log(result);
                deferred.resolve(result.data);
            });
            return deferred.promise;
        }
	}

  function EditarPlanChileController(stateParams, state, planCtaChileService, formatosImputs, rootScope) {
      var vm = this;
      //Agregando codigo para probar las validaciones.
      vm.formatosImputs = formatosImputs.formEditarPlanChile;
      vm.planCtaChile = {
          account: '',
    			name: '',
    			level1: '',
    			level2: '',
    			level3: ''
  		};
      vm.handleSubmit = guardarPlanCtaChile;
      vm.formEditarPlanChile = {};

      if (stateParams.id) {
          planCtaChileService.getById(stateParams.id)
          .then(function(getResult) {
              vm.planCtaChile = getResult.data;
          });
      } else {
        state.go('home.plan-chile');
      }

      function guardarPlanCtaChile() {
          planCtaChileService.updatePlanCtaChile(vm.planCtaChile)
          .then(function(updateResult) {
              rootScope.$broadcast(
                'event:toastMessage',
                'Datos guardados con éxito.',
                'md-primary'
              );
              state.go('home.plan-chile');
          })
      }
  }

})();

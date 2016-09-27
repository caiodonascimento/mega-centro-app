(function(){
  angular
       .module('app')
       .controller('PlanChileController', [ 'planCtaChileService', '$mdDialog',
          PlanChileController
       ])
       .controller('NuevoPlanChileController', [ '$state', 'planCtaChileService', 'formatosImputs',
				  '$rootScope',
          NuevoPlanChileController
       ])
       .controller('EditarPlanChileController', [
          EditarPlanChileController
       ]);

  function PlanChileController(planCtaChileService, $mdDialog) {
		  var vm = this;
		  vm.openMenu = openMenu;
		  vm.deletePlanCtaChile = deletePlanCtaChile;
		  vm.tableData = [];
		  vm.isOpen = false;
		  function cargaInicial() {
  			planCtaChileService.loadAllPlanCtaChile()
  			.then(function (planCtaChile) {
    				vm.tableData = planCtaChile.data.map(function(planCtaChile) {
      					planCtaChile.open = false;
      					return planCtaChile;
    				});
  			});
		  }
		  cargaInicial();
		  function openMenu($mdOpenMenu, event) {
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
  				    planCtaChileService.deletePlanCtaChile(planCtaChile);
  	    });
  		}
	}

  function NuevoPlanChileController($state, planCtaChileService, formatosImputs, rootScope) {
		var vm = this;
		vm.createPlanCtaChile = createPlanCtaChile;

		vm.formPlanChile = {};
		vm.formatosImputs = formatosImputs.formPlanChile;
		vm.planCtaChile = {
      account: '',
			name: '',
			level1: '',
			level2: '',
			level3: '',
		};

		function createPlanCtaChile() {
			planCtaChileService.insertPlanCtaChile(vm.planCtaChile)
			.then(function() {
				console.log('Exito');
				rootScope.$broadcast(
					'event:toastMessage',
					'Plan Cta. de Chile registrada con éxito.',
					'md-primary'
				);
				$state.go('home.plan-chile', {}, {location: 'replace'});
			});
		}
	}

})();

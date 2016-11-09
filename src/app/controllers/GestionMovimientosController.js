(function(){
	angular
  	.module('app')
  	.controller('GestionMovimientosController', [
			'$stateParams', '$state', 'movimientoService', 'storageService', '$rootScope', '$mdDialog',
  		GestionMovimientosController
  	]);
  function GestionMovimientosController(stateParams, state, movimientoService, localStorage, rootScope, $mdDialog) {
		var vm = this;
		vm.searchProcess = true;
		vm.query = {
      order: 'Date',
      limit: 10,
      page: 1
    };
		vm.arrayResults = [];
		vm.selected = [];
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		function init() {
			movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year, stateParams.month)
			.then(function(response) {
				vm.arrayResults = response.data.accountTransactions;
				console.log(vm.arrayResults);
				vm.searchProcess = false;
			});
		}
		console.log(stateParams.idEmpresa, stateParams.year, stateParams.month);
		if (stateParams.idEmpresa && stateParams.year) {
			init();
		} else {
			state.go('home.gestion-movimientos', {}, {location: 'replace'});
		}
		vm.getResults = getResults;
		function getResults() {

		}
		vm.showState = showState;
		function showState(state) {
			switch (state) {
				case 0:
					return 'Cargado';
					break;
				case 1:
					return 'Eliminado';
					break;
				case 2:
					return 'Autorizado';
					break;
				default:
					return 'Desconocido';
			}
		}
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
		vm.volver = volver;
		function volver() {
			state.go('home.gestion-movimientos', { empresa: stateParams.idEmpresa, year: stateParams.year, month: stateParams.month});
		}
		vm.deleteSelectedTransactions = deleteSelectedTransactions;
		function deleteSelectedTransactions() {
			var confirm = $mdDialog.confirm()
        .title('Eliminar Movimientos')
        .textContent('¿Desea eliminar los movimientos seleccionados definitivamente?')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Confirmar')
        .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				movimientoService.deleteByIds(_.pluck(vm.selected, 'id'))
				.then(function(response) {
					if (response.status === 200) {
						vm.selected = [];
						$mdDialog.show(
			      	$mdDialog.alert()
				        .clickOutsideToClose(true)
				        .title('Eliminar Movimientos')
				        .textContent('Movimientos eliminados con éxito.')
				        .ok('Ok')
			    	);
						init();
					}
				})
			});
		}
		vm.actualizarTransactions = actualizarTransactions;
		function actualizarTransactions($event) {
			var parentEl = angular.element(document.body);
			$mdDialog.show({
				parent: parentEl,
        targetEvent: $event,
	      controller: function DialogController($scope, $mdDialog, empresa) {
					$scope.cancel = function() {
						$mdDialog.cancel();
					}
					$scope.states = [
						{
							id: 0,
							name: 'Cargado'
						},
						{
							id: 2,
							name: 'Autorizado'
						}
					];
					$scope.chileanAccounts = [];
					planCtaChileService.loadAllPlanCtaChile(empresa)
					.then(function(result) {
						if (result.status === 200) {
							$scope.chileanAccounts = result.data;
						}
					});
					$scope.updateTransactions = function() {

					};
				},
	      templateUrl: './app/views/partials/edit-transaction-dialog.html',
				fullscreen: true,
				locals: {
					empresa: stateParams.idEmpresa
				}
	    })
	    .then(function(respuesta) {
				$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('Editar Movimientos')
					.textContent(respuesta)
					.ok('Ok');
	    });
		}
  }
})();

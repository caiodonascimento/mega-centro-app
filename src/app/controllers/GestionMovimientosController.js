(function(){
	angular
  	.module('app')
  	.controller('GestionMovimientosController', [
			'$stateParams', '$state', 'movimientoService', 'storageService', '$rootScope', '$mdDialog', 'planCtaChileService', 'planCtaOriginService',
  		GestionMovimientosController
  	]);
  function GestionMovimientosController(stateParams, state, movimientoService, localStorage, rootScope, $mdDialog, planCtaChileService, planCtaOriginService) {
		var vm = this;
		vm.searchProcess = true;
		vm.query = {
      order: 'Date',
      limit: 10,
      page: 1
    };
		vm.arrayResults = [];
		vm.selected = [];
		vm.cuentasOrigen = [];
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		function init() {
			vm.searchProcess = true;
			vm.selected = [];
			movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year, stateParams.month)
			.then(function(response) {
				vm.arrayResults = response.data.accountTransactions;
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
				case 3:
					return 'Contabilizado';
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
        .textContent('¿Desea eliminar el/los movimiento(s) seleccionado(s) definitivamente?')
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
	      controller: function DialogController($scope, $mdDialog, movimientoService, empresa, ids) {
					$scope.cancel = function() {
						$mdDialog.cancel();
					}
					$scope.changeState = false;
					$scope.changeAccount = false;
					$scope.states = [
						{
							id: 0,
							name: 'Cargado'
						},
						{
							id: 2,
							name: 'Autorizado'
						},
						{
							id: 3,
							name: 'Contabilizado'
						}
					];
					$scope.accounts = [];
					planCtaChileService.loadAllPlanCtaChile({
						id: empresa
					}).then(function(response) {
						if (response.status === 200) {
							console.log(response.data);
							_.each(response.data, function(chileAccount) {
								planCtaOriginService.loadAllPlanCtaOrigin(chileAccount.id)
								.then(function(res) {
									if (res.status === 200) {
										$scope.accounts = _.union($scope.accounts, res.data);
									}
								})
							});
						}
					});
					//$scope.accounts = cuentas;
					$scope.updateTransactions = function() {
						$scope.loading = true;
						var data = {};
						if ($scope.changeState) {
							data.status = $scope.state;
						}
						if ($scope.changeAccount) {
							data.originAccountId = $scope.account;
						}
						$scope.transactionsIds = _.pluck(ids, 'id');
						console.log($scope.transactionsIds);
						movimientoService.updateByIds(data, $scope.transactionsIds)
						.then(function(response) {
							console.log(response);
							if (response.count > 0) {
								$mdDialog.hide('Datos actualizados con éxito');
							} else {
								$mdDialog.hide('Error al guardar datos.');
							}
						}, function(error) {
							$mdDialog.hide('Error al guardar datos.');
						});
					};
				},
	      templateUrl: './app/views/partials/edit-transaction-dialog.html',
				fullscreen: true,
				locals: {
					empresa: stateParams.idEmpresa,
					ids: vm.selected
				}
	    }).then(function(respuesta) {
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Editar Movimientos')
						.textContent(respuesta)
						.ok('Ok')
				);
				init();
	    });
		}
  }
})();

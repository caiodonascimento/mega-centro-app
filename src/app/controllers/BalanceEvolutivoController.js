(function(){
	angular
  	.module('app')
		.controller('BalanceController', [
			'storageService', 'movimientoService', '$stateParams', '$state', 'planCtaChileService', '$mdDialog',
  		BalanceController
  	])
		.controller('BalanceEvolutivoController', [
			'storageService', 'movimientoService', '$stateParams', '$state', 'planCtaChileService', '$mdDialog',
  		BalanceEvolutivoController
  	]);
  function BalanceEvolutivoController(localStorage, movimientoService, stateParams, state, planCtaChileService, $mdDialog) {
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		function init() {
			vm.loading = true;
			vm.selected = [];
			movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year, stateParams.month)
			.then(function(response) {
				vm.arrayResults = response.data.accountTransactions;
				vm.loading = false;
			});
		}
  }

	function BalanceController(localStorage, movimientoService, stateParams, state, planCtaChileService, $mdDialog) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		vm.arrayData = [];
		function init() {
			vm.loading = true;
			vm.arrayData = [];
			movimientoService.getAllThen(vm.empresa, vm.year, vm.month)
			.then(function(response) {
				//response.data.accountTransactions;
				if (response.status !== 200) {
					vm.loading = true;
					return false;
				}
				var originalTransactions = response.data.accountTransactions;
				vm.originalTransactions = originalTransactions;
				if (stateParams.month !== '1') {
					movimientoService.getAllThen(vm.empresa, vm.year, (parseInt(vm.month)-1).toString())
					.then(function(responseAnt) {
						var originalTransactionsAnt = responseAnt.data.accountTransactions;
						var originAccounts = _.pluck(originalTransactions, 'originAccount');
						originAccounts = _.uniq(_.filter(originAccounts, function(value) {
							return value;
						}), false, function(value) {
							return value.id;
						});
						var chileAccounts = _.uniq(_.pluck(originAccounts, 'chileanAccountId'));
						if (chileAccounts.length > 0) {
							planCtaChileService.findByIds(chileAccounts)
							.then(function(resultData) {
								if (resultData.length > 0) {
									angular.forEach(originAccounts, function(origin) {
										origin.chileanAccount = _.findWhere(resultData, {id: origin.chileanAccountId});
										vm.arrayData.push({
											originAccount: origin,
											montoMes: _.reduce(originalTransactions, function(memo, transaction) {
												return memo + (transaction.originAccountId === origin.id ? parseFloat(transaction.liabilities) : 0);
											}, 0),
											montoMesAnterior: _.reduce(originalTransactionsAnt, function(memo, transaction) {
												return memo + (transaction.originAccountId === origin.id ? parseFloat(transaction.liabilities) : 0);
											}, 0)
										});
									});
								}
							});
						}
					});
				} else {
					var originAccounts = _.pluck(originalTransactions, 'originAccount');
					originAccounts = _.uniq(_.filter(originAccounts, function(value) {
						return value;
					}), false, function(value) {
						return value.id;
					});
					var chileAccounts = _.uniq(_.pluck(originAccounts, 'chileanAccountId'));
					if (chileAccounts.length > 0) {
						planCtaChileService.findByIds(chileAccounts)
						.then(function(resultData) {
							if (resultData.length > 0) {
								angular.forEach(originAccounts, function(origin) {
									origin.chileanAccount = _.findWhere(resultData, {id: origin.chileanAccountId});
									vm.arrayData.push({
										originAccount: origin,
										montoMes: _.reduce(originalTransactions, function(memo, transaction) {
											return memo + (transaction.originAccountId === origin.id ? parseFloat(transaction.liabilities) : 0);
										}, 0),
										montoMesAnterior: 0
									});
								});
							}
						});
					}
				}
				vm.loading = false;
			});
		}
		if (stateParams.idEmpresa && stateParams.year && stateParams.month) {
			vm.empresa = stateParams.idEmpresa;
			vm.year = stateParams.year;
			vm.month = stateParams.month;
			init();
		} else {
			state.go('home.balance', {}, {location: 'replace'});
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
			state.go('home.balance', {
				empresa: stateParams.idEmpresa,
				year: stateParams.year,
				month: stateParams.month
			});
		}
		vm.authAll = authAll;
		function authAll(data, event) {
			data.loading = true;
			var id = data.originAccount.id;
			var confirm = $mdDialog.confirm()
        .title('Autorizar Movimientos')
        .textContent('¿Desea cambiar el estado de el/los movimiento(s) definitivamente?')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Confirmar')
        .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				var ids = _.filter(vm.originalTransactions, function(value) {
					return value.originAccount.id === id;
				});
				ids = _.uniq(_.pluck(ids, 'id'));
				var dataMovimiento = {
					status: 2
				};
				movimientoService.updateByIds(dataMovimiento, ids)
				.then(function(response) {
					console.log(response);
					if (response.count > 0) {
						data.loading = false;
						$mdDialog.show(
							$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('Autorizar Movimientos')
								.textContent('Proceso terminado con éxito.')
								.ok('Ok')
						);
					} else {
						data.loading = false;
						$mdDialog.show(
							$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('Autorizar Movimientos')
								.textContent('Hubo un error al intentar autorizar todos los movimientos.')
								.ok('Ok')
						);
					}
				});
			}, function() {
				data.loading = false;
			});
		}
  }
})();

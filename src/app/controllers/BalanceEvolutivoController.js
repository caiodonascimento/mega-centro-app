(function(){
	angular
  	.module('app')
		.controller('BalanceController', [
			'storageService', 'movimientoService', '$stateParams', '$state', 'planCtaChileService',
  		BalanceController
  	])
		.controller('BalanceEvolutivoController', [
			'storageService', 'movimientoService', '$stateParams', '$state', 'planCtaChileService',
  		BalanceEvolutivoController
  	]);
  function BalanceEvolutivoController(localStorage, movimientoService, stateParams, state, planCtaChileService) {
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

	function BalanceController(localStorage, movimientoService, stateParams, state, planCtaChileService) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.loading = true;
		vm.arrayData = [];
		function init() {
			vm.loading = true;
			vm.arrayData = [];
			movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year, stateParams.month)
			.then(function(response) {
				//response.data.accountTransactions;
				if (response.status !== 200) {
					vm.loading = true;
					return false;
				}
				var originalTransactions = response.data.accountTransactions;
				if (stateParams.month !== '1') {
					movimientoService.getAllThen(stateParams.idEmpresa, stateParams.year, (stateParams.month-1))
					.then(function(responseAnt) {
						var originalTransactionsAnt = responseAnt.data.accountTransactions;
						var chileAccounts = [];
						_.each(originalTransactions, function(value, index) {
							if (value.originAccount) {
								chileAccounts.push(value.originAccount.chileanAccountId);
							}
						});
						var chileAccounts = _.uniq(chileAccounts);
						if (chileAccounts.length > 0) {
							planCtaChileService.findByIds(chileAccounts)
							.then(function(resultData) {
								if (resultData.length > 0) {
									var originAccounts = _.pluck(originalTransactions, 'originAccount');
									originAccounts = _.uniq(_.filter(originAccounts, function(value) {
										return value;
									}), false, function(value) {
										return value.id;
									});
									_.each(resultData, function(chileanAccount, index) {
										var actualOriginAccounts = _.filter(originAccounts, function(value) {
											return value.chileanAccountId === chileanAccount.id;
										});
										_.each(actualOriginAccounts, function(originAccount) {
											chileanAccount.montoMes = 0;
											chileanAccount.montoMesAnt = 0;
											chileanAccount.transactions = [];
											chileanAccount.transactionsAnt = [];
											chileanAccount.transactions = _.filter(originalTransactions, function(transaction) {
												return transaction.originAccountId === originAccount.id;
											});
											chileanAccount.transactionsAnt = _.filter(originalTransactionsAnt, function(transaction) {
												return transaction.originAccountId === originAccount.id;
											});
											chileanAccount.montoMes = _.reduce(chileanAccount.transactions, function(memo, transaction) {
												return memo + (parseFloat(transaction.liabilities) || 0);
											}, 0);
											chileanAccount.montoMesAnterior = _.reduce(chileanAccount.transactionsAnt, function(memo, transaction) {
												return memo + (parseFloat(transaction.liabilities) || 0);
											}, 0);
											chileanAccount.originAccount = originAccount;
											vm.arrayData.push(chileanAccount);
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
  }
})();

(function(){
	angular
  	.module('app')
  	.controller('GestionMovimientosController', [
			'$stateParams', '$state', 'movimientoService',
  		GestionMovimientosController
  	]);
  function GestionMovimientosController(stateParams, state, movimientoService) {
		var vm = this;

		function init() {
			
		}
		if (stateParams.idEmpresa && stateParams.year && stateParams.month) {
			init();
		} else {
			state.go('home.gestion-movimientos', {}, {location: 'replace'});
		}
  }
})();

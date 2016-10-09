(function(){
	angular
		.module('app')
		.controller('LevelController', [ 'levelsService', '$mdDialog',
			'$rootScope', 'storageService',
			LevelController
		])
		.controller('NuevoLevelController', [ '$state', 'levelsService', 'formatosImputs',
			'$rootScope',
			NuevoLevelController
		])
		.controller('EditarLevelController', [ '$stateParams', '$state', 'levelsService', 'formatosImputs',
			'$rootScope',
			EditarLevelController
		]);

	function LevelController(levelsService, $mdDialog, rootScope, localStorage) {
		var vm = this;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.openMenu = openMenu;
		vm.deleteLevel = deleteLevel;
		vm.tableData = [];
		vm.isOpen = false;
		function cargaInicial() {
			levelsService.loadAllLevels()
			.then(function (levels) {
				vm.tableData = levels.data;
			});
		}
		cargaInicial();
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
		function deleteLevel(level, event) {
			var confirm = $mdDialog.confirm()
        .title('Levels')
        .textContent('¿Desea eliminar el nivel ' + level.name + ' definitivamente?')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Confirmar')
        .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
				levelsService.deleteLevel(level)
				.then(function() {
					cargaInicial();
					$mdDialog.show(
		      	$mdDialog.alert()
			        .clickOutsideToClose(true)
			        .title('Eliminando Level')
			        .textContent('Nivel ' + level.name + ' eliminada con éxito.')
			        .ok('Ok')
		    	);
				});
	    });
		}
	}

	function NuevoLevelController($state, levelsService, formatosImputs, rootScope) {
		var vm = this;
		vm.createLevel = createLevel;

		vm.formLevel = {};
		vm.formatosImputs = formatosImputs.formLevel;
		vm.level = {
			name: '',
			description: '',
      type: ''
		};

		function createLevel() {
			levelsService.insertLevels(vm.level)
			.then(function() {
				console.log('Exito');
				rootScope.$broadcast(
					'event:toastMessage',
					'Nivel registrado con éxito.',
					'md-primary'
				);
				$state.go('home.levels', {}, {location: 'replace'});
			});
		}
	}

  function EditarLevelController(stateParams, state, levelsService, formatosImputs, rootScope) {
		var vm = this;
		//Agregando codigo para probar las validaciones.
		vm.formatosImputs = formatosImputs.formEditarLevel;
		vm.level = {
      name: '',
			description: '',
      type: ''
		};
		vm.handleSubmit = guardarLevel;
		vm.formEditar = {};

		if (stateParams.id) {
			levelsService.getById(stateParams.id)
			.then(function(getResult) {
				vm.level = getResult.data;
			});
		} else {
			state.go('home.levels');
		}

		function guardarLevel() {
			levelsService.updateLevel(vm.level)
			.then(function(updateResult) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Datos guardados con éxito.',
					'md-primary'
				);
				state.go('home.levels');
			})
		}
  }

})();

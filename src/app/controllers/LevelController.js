(function(){
	angular
			.module('app')
			.controller('LevelController', [ 'levelsService', '$mdDialog',
				'storageService', '$rootScope',
				LevelController
			])
			.controller('NuevoLevelController', [ '$state', 'levelsService',
				'formatosImputs', '$rootScope',
				NuevoLevelController
			])
			.controller('EditarLevelController', [ '$stateParams', '$state',
				'levelsService', 'formatosImputs', '$rootScope',
				EditarLevelController
			]);

	function LevelController(levelsService, $mdDialog, localStorage, rootScope) {
		var vm = this;
		vm.loading = false;
		vm.viewAccess = localStorage.getObject('selectedMenuItem') || {};
		vm.openMenu = openMenu;
		vm.deleteLevel = deleteLevel;
		vm.tableData = [];
		vm.isOpen = false;
		function cargaInicial() {
			vm.loading = true;
			levelsService.loadAllLevels()
			.then(function (levels) {
					vm.tableData = levels.data;
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
			level.loading = true;
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
			        .title('Eliminando el Nivel')
			        .textContent('Nivel ' + level.name + ' eliminado con éxito.')
			        .ok('Ok')
		    	);
					level.loading = false;
				},
				function(error) {
					rootScope.$broadcast(
						'event:toastMessage',
						'Ha ocurrido un error, favor comunicarse con el administrador.',
						'md-alert'
					);
					level.loading = false;
				});
	    },
			function() {
				level.loading = false;
			});
		}
	}

	function NuevoLevelController($state, levelsService, formatosImputs, rootScope) {
		var vm = this;

		vm.loading = false;
		vm.createLevel = createLevel;
		vm.formLevel = {};
		vm.formatosImputs = formatosImputs.formLevel;
		vm.level = {
			name: '',
			description: '',
  		type: ''
		};
		vm.levels = [
			'1',
			'2'
		];

		function createLevel() {
			vm.loading = true;
			levelsService.insertLevels(vm.level)
			.then(function() {
				rootScope.$broadcast(
					'event:toastMessage',
					'Nivel registrado con éxito.',
					'md-primary'
				);
				$state.go('home.levels', {}, {location: 'replace'});
				vm.loading = false;
			},
			function(error) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un problema, favor vuelva a intentarlo.',
					'md-primary'
				);
				vm.loading = false;
			});
		}
	}

  function EditarLevelController(stateParams, state, levelsService, formatosImputs, rootScope) {
		var vm = this;
		vm.loading = false;
		vm.charge = true;
		vm.formatosImputs = formatosImputs.formLevel;
		vm.level = {
      name: '',
			description: '',
      type: ''
		};
		vm.handleSubmit = guardarLevel;
		vm.formLevel = {};

		if (stateParams.id) {
			levelsService.getById(stateParams.id)
			.then(function(getResult) {
				vm.level = getResult.data;
				vm.charge = false;
			},
			function(error) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-primary'
					);
					state.go('home.levels');
					vm.charge = false;
			});
		} else {
			state.go('home.levels');
		}

		function guardarLevel() {
			vm.loading = true;
			levelsService.updateLevel(vm.level)
			.then(function(updateResult) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Datos guardados con éxito.',
					'md-primary'
				);
				state.go('home.levels');
				vm.loading = false;
			},
			function(error) {
				rootScope.$broadcast(
					'event:toastMessage',
					'Ha ocurrido un error, favor comunicarse con el Administrador.',
					'md-primary'
				);
				vm.loading = false;
			});
		}
  }

})();

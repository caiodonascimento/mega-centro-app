'use strict';

angular.module('mega.centro', ['ngAnimate', 'ngCookies', 'ngTouch',
  'ngSanitize', 'ui.router', 'anim-in-out', 'ngMaterial', 'nvd3', 'app',
  'angular-js-xlsx', 'ngFileUpload', 'md.data.table', 'angular-cache', 'ngIdle'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, IdleProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/views/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
      })
      .state('home', {
        url: '',
        templateUrl: 'app/views/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        abstract: true,
        resolve: {
          navItems: function(navService) {
            return navService.loadAllItems();
          }
        }
      })
      .state('home.inicio', {
        url: '/inicio',
        templateUrl: 'app/views/inicio.html',
        controller: 'InicioController',
        controllerAs: 'vm',
        data: {
          title: 'Inicio'
        }
      })
      .state('home.usuarios', {
        url: '/usuarios',
        templateUrl: 'app/views/usuarios.html',
        controller: 'UsuariosController',
        controllerAs: 'vm',
        data: {
          title: 'Usuarios'
        }
      })
      .state('home.usuarios-nuevo', {
        url: '/usuarios/nuevo',
        templateUrl: 'app/views/forms/nuevo-usuario.html',
        controller: 'NuevoUsuarioController',
        controllerAs: 'vm',
        data: {
          title: 'Usuarios'
        }
      })
      .state('home.usuarios-edit', {
        url: '/usuarios/editar/{id}',
        templateUrl: 'app/views/forms/editar-usuario.html',
        controller: 'EditarUsuarioController',
        controllerAs: 'vm',
        data: {
          title: 'Usuarios'
        }
      })
      .state('home.empresas', {
        url: '/empresas',
        controller: 'EmpresaController',
        controllerAs: 'vm',
        templateUrl: 'app/views/empresa.html',
        data: {
          title: 'Empresas'
        }
      })
      .state('home.empresas-nueva', {
        url: '/empresas/nueva',
        controller: 'NuevaEmpresaController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/nueva-empresa.html',
        data: {
          title: 'Empresas',
        }
      })
      .state('home.empresas-editar', {
        url: '/empresas/editar/{id}',
        controller: 'EditarEmpresaController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/editar-empresa.html',
        data: {
          title: 'Empresas',
        }
      })
      .state('home.plan-chile', {
        url: '/search-account/chile/?idEmpresa',
        controller: 'SearchAccountController',
        controllerAs: 'vm',
        templateUrl: 'app/views/partials/search-account.html',
        data: {
          title: 'Plan Cta. Chile'
        }
      })
      .state('home.plan-chile-data', {
        url: '/plan-chile/{idEmpresa}',
        controller: 'PlanChileController',
        controllerAs: 'vm',
        templateUrl: 'app/views/plan-chile.html',
        data: {
          title: 'Plan Cta. Chile'
        }
      })
	  .state('home.plan-chile-nuevo', {
        url: '/plan-chile/nuevo/{idEmpresa}',
        controller: 'NuevoPlanChileController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/nuevo-plan-chile.html',
        data: {
          title: 'Plan Cta. Chile'
        }
      })
	  .state('home.plan-chile-editar', {
        url: '/plan-chile/editar/{id}',
        controller: 'EditarPlanChileController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/editar-plan-chile.html',
        data: {
          title: 'Plan Cta. Chile'
        }
      })
      .state('home.plan-origen', {
        url: '/search-account/origin/?idCuenta',
        controller: 'SearchAccountController',
        controllerAs: 'vm',
        templateUrl: 'app/views/partials/search-account.html',
        data: {
          title: 'Plan Cta. Origen'
        }
      })
      .state('home.plan-origen-data', {
        url: '/plan-origen/{idCuenta}',
        controller: 'PlanOrigenController',
        controllerAs: 'vm',
        templateUrl: 'app/views/plan-origen.html',
        data: {
          title: 'Plan Cta. Origen'
        }
      })
      .state('home.plan-origen-nuevo', {
        url: '/plan-origen/nuevo/{idCuenta}',
        controller: 'PlanOrigenNuevoController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/nuevo-plan-origen.html',
        data: {
          title: 'Plan Cta. Origen'
        }
      })
      .state('home.plan-origen-editar', {
        url: '/plan-origen/editar/{idCuentaOrigen}',
        controller: 'PlanOrigenEditarController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/editar-plan-origen.html',
        data: {
          title: 'Plan Cta. Origen'
        }
      })
      .state('home.perfil', {
        url: '/perfil',
        templateUrl: 'app/views/perfil.html',
        controller: 'PerfilController',
        controllerAs: 'vm',
        data: {
          title: 'Mi Perfil'
        }
      })
      .state('home.carga-movimientos', {
        url: '/carga-movimientos',
        templateUrl: 'app/views/carga-movimientos.html',
        controller: 'CargaMovimientosController',
        controllerAs: 'vm',
        data: {
          title: 'Carga de Movimientos'
        }
      })
      .state('home.gestion-movimientos', {
        url: '/gestion-movimientos',
        templateUrl: 'app/views/gestion-movimientos.html',
        controller: 'ConsultaMovimientosController',
        controllerAs: 'vm',
        data: {
          title: 'Gestión de Movimientos'
        }
      })
      .state('home.gestion-movimientos-data', {
        url: '/gestion-movimientos/{idEmpresa}/{year}/{month}',
        templateUrl: 'app/views/gestion-movimientos-data.html',
        controller: 'GestionMovimientosController',
        controllerAs: 'vm',
        data: {
          title: 'Gestión de Movimientos'
        }
      })
      .state('home.balance-ev', {
        url: '/balance-ev',
        templateUrl: 'app/views/balance-ev.html',
        controller: 'BalanceEvolutivoController',
        controllerAs: 'vm',
        data: {
          title: 'Balance Evolutivo'
        }
      })
      .state('home.genera-archivo', {
        url: '/genera-archivo',
        templateUrl: 'app/views/genera-archivo.html',
        controller: 'GeneraArchivoController',
        controllerAs: 'vm',
        data: {
          title: 'Genera Archivo'
        }
      })
      .state('home.levels', {
        url: '/levels',
        controller: 'LevelController',
        controllerAs: 'vm',
        templateUrl: 'app/views/level.html',
        data: {
          title: 'Niveles'
        }
      })
      .state('home.levels-nuevo', {
        url: '/levels/nuevo',
        controller: 'NuevoLevelController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/nuevo-level.html',
        data: {
          title: 'Niveles',
        }
      })
      .state('home.levels-editar', {
        url: '/levels/editar/{id}',
        controller: 'EditarLevelController',
        controllerAs: 'vm',
        templateUrl: 'app/views/forms/editar-level.html',
        data: {
          title: 'Niveles',
        }
      });
    $urlRouterProvider.otherwise('/inicio');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    IdleProvider.idle(10 * 60 - 5);
    IdleProvider.timeout(5);
  });

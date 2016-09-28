'use strict';

angular.module('mega.centro', ['ngAnimate', 'ngCookies', 'ngTouch',
  'ngSanitize', 'ui.router', 'anim-in-out', 'ngMaterial', 'nvd3', 'app', 'ngStorage'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                    $mdIconProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

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
        abstract: true
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
        url: '/plan-chile',
        controller: 'PlanChileController',
        controllerAs: 'vm',
        templateUrl: 'app/views/plan-chile.html',
        data: {
          title: 'Plan Cta. Chile'
        }
      })
	  .state('home.plan-chile-nuevo', {
        url: '/plan-chile/nuevo',
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
        url: '/plan-origen',
        controller: 'PlanOrigenController',
        controllerAs: 'vm',
        templateUrl: 'app/views/plan-origen.html',
        data: {
          title: 'Plan Cta. Origen'
        }
      })
      .state('home.profile', {
        url: '/profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: {
          title: 'Profile'
        }
      })
      .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html',
        data: {
          title: 'Dashboard'
        }
      });

    $urlRouterProvider.otherwise('/login');

  });

'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies', 'ngTouch',
  'ngSanitize', 'ui.router', 'anim-in-out', 'ngMaterial', 'nvd3', 'app', 'ngStorage'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                    $mdIconProvider) {
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
      .state('home.empresas', {
        url: '/empresas',
        controller: 'EmpresaController',
        controllerAs: 'vm',
        templateUrl: 'app/views/empresa.html',
        data: {
          title: 'Empresas'
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

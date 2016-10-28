(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q', '$http', 'apiRoutes', '$mdDialog', '$state',
          navService
  ]);

  function navService($q, $http, apiRoutes, $mdDialog, $state){
    return {
      loadAllItems : function() {
        var deferred = $q.defer();
        $http.get(
          apiRoutes.usuarios + '/menu'
        ).then(function(response) {
          var menuItems = [];
          if (response.status === 200) {
            menuItems = response.data.menuItems.filter(function(menuItem) {
              return menuItem.menuDetail.length > 0;
            });
          } else {
            $mdDialog.show({
              title: 'Error al cargar datos de usuario',
              templateUrl: 'app/views/partials/messageDialog.html',
              parent: angular.element(document.body),
              controllerAs: 'vm',
              controller: function($mdDialog) {
                var vm = this;
                vm.title = '¡Ojo! ocurrió un error';
                vm.content = 'No se pudó obtener los datos de usuario. <br/>' +
                  'Favor volver a conectarse más tarde o contacta a un administrador.';
                vm.withClose = false;
                vm.withAction = true;
                vm.close = function() {
                  $mdDialog.hide();
                };
                vm.textAction = 'Refrescar vista';
                vm.action = function() {
                  $mdDialog.hide();
                  $state.reload();
                }
              },
              fullscreen: false
            });
          }
          deferred.resolve(menuItems);
        }, function(error) {
          deferred.reject([]);
        });
        return deferred.promise;
      }
    };
  }

})();

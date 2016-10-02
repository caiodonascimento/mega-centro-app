(function(){

  angular
       .module('app')
       .controller('MainController', [
          'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast',
          'storageService', '$rootScope',
          MainController
       ]);

  function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, localStorage, rootScope) {
    var vm = this;

    vm.menuItems = [ ];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;
    vm.toggleRightSidebar = toggleRightSidebar;
    vm.user = localStorage.getObject('currentUser');
    vm.exitToApp = exitToApp;

    navService
      .loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
      });

    function exitToApp() {
      localStorage.clearAll();
      $state.go('login', {}, {location: 'replace'});
    }

    function toggleRightSidebar() {
        $mdSidenav('right').toggle();
    }

    function toggleItemsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    function selectItem (item) {
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }

    function showSimpleToast(title) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(2000)
          .position('bottom right')
      );
    }

    function showResultToast(title, type) {
      $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(3500)
          .position('bottom right')
          .highlightClass(type)
      );
    }

    rootScope.$on('event:toastMessage', function(event, title, type) {
      console.log(event, title, type);
      showResultToast(title, type);
    });
  }

})();

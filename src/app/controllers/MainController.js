(function(){

  angular
       .module('app')
       .controller('MainController', [
          'navItems', '$mdSidenav', '$mdBottomSheet', '$state', '$mdToast',
          'storageService', '$rootScope',
          MainController
       ]);

  function MainController(navItems, $mdSidenav, $mdBottomSheet, $state, $mdToast, localStorage, rootScope) {
    var vm = this;

    vm.menuItems = navItems;
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.seeProfile = seeProfile;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;
    vm.toggleRightSidebar = toggleRightSidebar;
    vm.user = localStorage.getObject('currentUser');
    vm.exitToApp = exitToApp;
    vm.selectedItem = null;

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

    function seeProfile() {
      selectItem({
        name: 'Mi Perfil',
        menuDetail: [{}]
      });
    }

    function selectItem(item) {
      vm.selectedItem = item;
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
      showResultToast(title, type);
    });

    rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      var item = vm.selectedItem;
      localStorage.setObject('selectedMenuItem', item.menuDetail[0]);
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    });
  }

})();

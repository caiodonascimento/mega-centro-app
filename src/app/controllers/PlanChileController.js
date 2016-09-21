(function(){

  angular
       .module('app')
       .controller('PlanChileController', [
          PlanChileController
       ]);

  function PlanChileController() {
    var vm = this;

    vm.tableData = [
      {
        id: 111,
        accont: '124234',
        name: 'Capital',
        level1: 'Clase 1',
        level2: 'Clase 2',
        level3: 'Clase 3',
      }
    ];
  }

})();

(function(){

    angular
        .module('app')
        .controller('PlanOrigenController', ['$q', 'empresasService',
            PlanOrigenController
        ]);

    function PlanOrigenController($q, empresasService) {
        var vm = this;

        vm.searchForm = {};
        vm.searchText = null;
        vm.empresa = null;
        vm.querySearchEmpresa = querySearchEmpresa;
        vm.searchProcess = false;
        vm.filterAccounts = filterAccounts;
        
        function querySearchEmpresa(query) {
          var defer = $q.defer();
          empresasService.findLikeName(query)
          .then(function (response) {
            defer.resolve(response.data);
          }, function (error) {
            defer.reject([]);
          });
          return defer.promise;
        }

        function filterAccounts() {
          if (vm.searchForm.$valid) {
            vm.searchProcess = true;
          }
        }
    }

})();

(function(){

    angular
        .module('app')
        .controller('PlanOrigenController', ['$q', '$timeout',
            PlanOrigenController
        ]);

    function PlanOrigenController($q, $timeout) {
        var vm = this;

        vm.tableData = [
            {
                id: 111,
                accont: '124234',
                name: 'Capital',
                ctaChile: {
                    name: 'Cuenta de Chile numero 1',
                    cod: 1233
                }
            }
        ];
        vm.searchForm = {};
        vm.states = loadAll();
        vm.selectedItem = null;
        vm.searchText = null;
        vm.toolbarOpen = false;
        vm.querySearch = querySearch;
        vm.searchProcess = false;
        vm.filterAccounts = filterAccounts;

        function querySearch (query) {
            var results = query ? vm.states.filter( createFilterFor(query) ) : self.states;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

            return allStates.split(/, +/g).map( function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }

        function filterAccounts() {
          vm.searchProcess = true;
        }
    }

})();

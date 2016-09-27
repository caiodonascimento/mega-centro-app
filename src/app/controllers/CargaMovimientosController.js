(function(){

  angular
    .module('app')
    .controller('CargaMovimientosController', [
      '$q', 'empresasService',
      CargaMovimientosController
    ]);

  function CargaMovimientosController($q, empresasService) {
    var vm = this;
    vm.handleSubmitCarga = handleSubmitCarga;
    vm.cargaForm = {};
    vm.carga = {
      empresa: ''
    };
    vm.searchProcess = false;
    vm.searchText = null;
    vm.querySearchEmpresa = querySearchEmpresa;
    vm.years = years;
    vm.months = [
      {
        id: 1,
        name: 'Enero'
      },
      {
        id: 2,
        name: 'Febrero'
      },
      {
        id: 3,
        name: 'Marzo'
      },
      {
        id: 4,
        name: 'Abril'
      },
      {
        id: 5,
        name: 'Mayo'
      },
      {
        id: 6,
        name: 'Junio'
      },
      {
        id: 7,
        name: 'Julio'
      },
      {
        id: 8,
        name: 'Agosto'
      },
      {
        id: 9,
        name: 'Septiembre'
      },
      {
        id: 10,
        name: 'Octubre'
      },
      {
        id: 11,
        name: 'Noviembre'
      },
      {
        id: 12,
        name: 'Diciembre'
      }
    ]

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

    function years() {
      var array = [];
      var yearInit = 2000;
      var yearFinish = parseInt((new Date()).getFullYear());
      for (var intervalo = 0; intervalo <= yearFinish - yearInit; intervalo++) {
        array.push(yearInit + intervalo);
      }
      return array;
    }

    function handleSubmitCarga() {
      vm.searchProcess = true;
    }
  }

})();

(function(){

  angular
    .module('app')
    .controller('CargaMovimientosController', [
      '$q', 'empresasService', '$rootScope', '$timeout', '$scope',
      CargaMovimientosController
    ]);

  function CargaMovimientosController($q, empresasService, rootScope, $timeout, scope) {
    var vm = this;
    vm.handleSubmitCarga = handleSubmitCarga;
    vm.cargaForm = {};
    vm.carga = {
      empresa: '',
      year: '',
      month: '',
      file: null
    };
    var oriCarga = angular.copy(vm.carga);
    vm.filename = '';
    vm.searchProcess = false;
    vm.searchText = null;
    vm.promise = null;
    vm.querySearchEmpresa = querySearchEmpresa;
    vm.upload = upload;
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
    vm.selected = [];
    vm.correctResults = [];
    vm.arrayResults = [];
    vm.query = {
      order: 'Date',
      limit: 5,
      page: 1
    };
    vm.mimeTypes = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    vm.loadingCarga = false;
    vm.getResults = getResults;
    vm.cancelarCarga = cancelarCarga;
    vm.reader = new FileReader();
    vm.reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {type: 'binary'});
      workbook.SheetNames.forEach(function(sheetName) {
        vm.carga.file = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      });
      console.log(vm.carga.file);
    };
    vm.reader.onerror = function(e) {
      rootScope.$broadcast(
        'event:toastMessage',
        'Hubo un error al leer el archivo, favor comunicarse con un Administardor.',
        'md-primary'
      );
    };
    vm.reader.onloadstart = function(e) {
      vm.loadingCarga = true;
    };
    vm.reader.onloadend = function(e) {
      $timeout(function() {
        vm.loadingCarga = false;
      }, 1500);
    };

    function getResults() {
      vm.promise = $q.when(
        vm.arrayResults = _.filter(vm.correctResults, function(value, index) {
          var initIndex = (vm.query.page * vm.query.limit) - vm.query.limit;
          var endIndex = vm.query.page * vm.query.limit;
          return index >= initIndex && index < endIndex;
        })
      );
    }

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
      var yearInit = parseInt((new Date()).getFullYear()) - 3;
      var yearFinish = parseInt((new Date()).getFullYear());
      for (var intervalo = 0; intervalo <= yearFinish - yearInit; intervalo++) {
        array.push(yearInit + intervalo);
      }
      return array;
    }

    function handleSubmitCarga() {
      vm.loadingCarga = true;
      console.log(new Date(), 'Init validation');
      _.forEach(vm.carga.file, function(value, index) {
        if (!value.hasOwnProperty('Date') || !value.hasOwnProperty('Num')
            || !value.hasOwnProperty('Name') || !value.hasOwnProperty('Memo')
            || !value.hasOwnProperty('Account') || !value.hasOwnProperty('Split')
            || !value.hasOwnProperty('Amount') || !value.hasOwnProperty('TC') || !value.hasOwnProperty('Pesos Liabilities')) {
          return false;
        }
        var date = new Date(value.Date);
        console.log(index);
        if (date === null || date === undefined) {
          return false;
        }
        if (date.getFullYear() !== vm.carga.year) {
          return false;
        }
        if (date.getMonth()+1 !== vm.carga.month) {
          return false;
        }
        vm.correctResults.push(value);
      });
      var arrayProcess = vm.correctResults.map(function(value) {
        return $q.when();
      });
      rootScope.$broadcast('event:end-carga');
    }

    function upload(file) {
      if (!file) {
        return false;
      }
      var extensions = file.name.split('.');
      if (extensions.length <= 1) {
        rootScope.$broadcast(
          'event:toastMessage',
          'El archivo cargado no es válido.',
          'md-primary'
        );
        vm.filename = '';
        return false;
      }
      var extension = extensions[extensions.length - 1];
      if (extension !== 'xls' && extension !== 'xlsx') {
        rootScope.$broadcast(
          'event:toastMessage',
          'Favor cargar archivos solo en formato excel.',
          'md-primary'
        );
        vm.filename = '';
        return false;
      }
      vm.filename = file.name;
      vm.reader.readAsBinaryString(file);
    };

    function cancelarCarga() {
      vm.carga = angular.copy(oriCarga);
      vm.filename = '';
      vm.searchProcess = false;
      vm.cargaForm.$setPristine();
    }

    scope.$on('event:end-carga', function() {
      if (vm.correctResults.length === 0) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Archivo no tiene filas válidas para la carga, favor revisarlo y volver a intentarlo.',
          'md-primary'
        );
      } else {
        rootScope.$broadcast(
          'event:toastMessage',
          'Archivo cargado, ' + vm.correctResults.length + ' filas se cargaron con éxito.',
          'md-primary'
        );
        vm.searchProcess = true;
      }
      vm.loadingCarga = false;
    });
  }

})();

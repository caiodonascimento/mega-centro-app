(function(){

  angular
    .module('app')
    .controller('CargaMovimientosController', [
      '$q', 'empresasService', '$rootScope', '$timeout', '$scope', 'cargaService', '$mdDialog', '$state',
      CargaMovimientosController
    ]);

  function CargaMovimientosController($q, empresasService, rootScope, $timeout, scope, cargaService, $mdDialog, state) {
    var vm = this;
    vm.handleSubmitCarga = handleSubmitCarga;
    vm.cargaForm = {};
    vm.carga = {
      empresa: '',
      year: '',
      month: '',
      file: []
    };
    vm.currentCharge = {
      id: 0
    }
    var oriCarga = angular.copy(vm.carga);
    vm.filename = '';
    vm.searchProcess = false;
    vm.searchProcessResult = false;
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
    ];
    vm.colorResult = 'green-300';
    vm.selected = [];
    vm.correctResults = [];
    vm.arrayResults = [];
    vm.query = {
      order: 'Date',
      limit: 5,
      page: 1
    };
    vm.erroresCarga = {
      dateLess: 0,
      numLess: 0,
      nameLess: 0,
      memoLess: 0,
      accountLess: 0,
      splitLess: 0,
      amountLess: 0,
      tcLess: 0,
      liabilitiesLess: 0,
      dateFail: 0,
      notYear: 0,
      notMonth: 0,
      amountFail: 0,
      liabilitiesFail: 0,
      notPushed: []
    };
    var erroresCargaOri = angular.copy(vm.erroresCarga);
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

    function upCharge() {
      cargaService.generateHeader(vm.carga)
      .then(function(resultadoHeader) {
        console.log(resultadoHeader);
        vm.currentCharge = resultadoHeader.data;
        cargaService.saveAccountTransaction(vm.correctResults, vm.currentCharge.id)
        .then(function(resultadoFilas) {
          console.log(resultadoFilas);
          rootScope.$broadcast('event:end-carga');
        });
      });
    }

    function handleSubmitCarga() {
      vm.loadingCarga = true;
      _.forEach(vm.carga.file, function(value, index) {
        var result = true;
        if (!value.hasOwnProperty('Date')) {
          result = false;
        }
        if (!value.hasOwnProperty('Num')) {
          vm.erroresCarga.numLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Name')) {
          vm.erroresCarga.nameLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Memo')) {
          vm.erroresCarga.memoLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Account')) {
          vm.erroresCarga.accountLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Split')) {
          vm.erroresCarga.splitLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Amount')) {
          vm.erroresCarga.amountLess++;
          result = false;
        }
        if (!value.hasOwnProperty('TC')) {
          vm.erroresCarga.tcLess++;
          result = false;
        }
        if (!value.hasOwnProperty('Pesos Liabilities')) {
          vm.erroresCarga.liabilitiesLess++;
          result = false;
        }
        var date = new Date(value.Date);
        if (date === null || date === undefined) {
          vm.erroresCarga.dateFail++;
          result = false;
        }
        if (date.getFullYear() !== vm.carga.year) {
          vm.erroresCarga.notYear++;
          result = false;
        }
        if (date.getMonth()+1 !== vm.carga.month) {
          vm.erroresCarga.notMonth++;
          result = false;
        }
        var amount = parseInt(value.Amount, 10);
        if (!_.isNumber(amount)) {
          vm.erroresCarga.amountFail++;
          result = false;
        }
        var liabilities = parseInt(value['Pesos Liabilities'], 10);
        if (!_.isNumber(liabilities)) {
          vm.erroresCarga.liabilitiesFail++;
          result = false;
        }
        if (!result) {
          return result;
        }
        vm.correctResults.push(value);
      });
      upCharge();
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
      var confirm = $mdDialog.confirm()
      .title('Carga de Movimientos')
      .textContent(
        '¿Desea cancelar la carga en curso y volver al formulario de carga?'
      )
      .ariaLabel('Lucky day')
      .targetEvent(event)
      .ok('Cancelar la carga')
      .cancel('Continuar con la carga actual');
      $mdDialog.show(confirm).then(function() {
        var dialog = $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Cancelando carga actual')
          .textContent(
            'Favor esperar, estamos cancelando la carga actual ...'
          );
        $mdDialog.show(dialog);
        cargaService.cancelCharge(vm.currentCharge.id)
        .then(function() {
          $timeout(function() {
            vm.searchProcessResult = false;
            vm.carga = angular.copy(oriCarga);
            vm.erroresCarga = angular.copy(erroresCargaOri);
            vm.filename = '';
            vm.searchProcess = false;
            vm.cargaForm.$setPristine();
            vm.cargaForm.$setUntouched();
            $mdDialog.hide(dialog);
          }, 1500);
        });
      });
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
        if (vm.carga.file.length !== vm.correctResults.length) {
          vm.colorResult = 'red-300';
        } else {
          vm.colorResult = 'green-300';
        }
        vm.searchProcessResult = true;
        vm.searchProcess = true;
      }
      vm.loadingCarga = false;
    });

    rootScope.$on('$stateChangeStart', function(event, toState){
      if (vm.searchProcess) {
        event.preventDefault();
        var confirm = $mdDialog.confirm()
            .title('Carga de Movimientos')
            .textContent('¿Desea cancelar la carga en curso y volver al formulario de carga?')
            .ariaLabel('Lucky day')
            .targetEvent(event)
            .ok('Cancelar la carga')
            .cancel('Continuar con la carga actual');
        $mdDialog.show(confirm).then(function() {
          var dialog = $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Cancelando carga actual')
              .textContent('Favor esperar, estamos cancelando la carga actual ...');
          $mdDialog.show(dialog);
          cargaService.cancelCharge(vm.currentCharge.id)
              .then(function() {
                $timeout(function() {
                  vm.searchProcessResult = false;
                  vm.carga = angular.copy(oriCarga);
                  vm.erroresCarga = angular.copy(erroresCargaOri);
                  vm.filename = '';
                  vm.searchProcess = false;
                  vm.cargaForm.$setPristine();
                  vm.cargaForm.$setUntouched();
                  $mdDialog.hide(dialog);
                  state.go(toState.name);
                }, 1500);
              });
        });
      }
    })
  }

})();

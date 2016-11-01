(function(){

  angular
    .module('app')
    .controller('CargaMovimientosController', [
      '$q', 'empresasService', '$rootScope', '$timeout', '$scope', 'cargaService',
      '$mdDialog', '$state', 'commonService', 'storageService',
      CargaMovimientosController
    ]);

  function CargaMovimientosController($q, empresasService, rootScope, $timeout,
    scope, cargaService, $mdDialog, state, commonService, localStorage) {
    var vm = this;
    vm.handleSubmitCarga = handleSubmitCarga;
    vm.cargaForm = {};
    vm.carga = {
      empresa: '',
      file: []
    };
    vm.currentCharge = {};
    var oriCarga = angular.copy(vm.carga);
    vm.filename = '';
    vm.searchProcess = false;
    vm.searchProcessResult = false;
    vm.activarFinalizados = false;
    vm.loadingFinish = false;
    vm.searchText = null;
    vm.promise = null;
    vm.querySearchEmpresa = querySearchEmpresa;
    vm.upload = upload;
    vm.colorResult = 'green-300';
    vm.selected = [];
    vm.correctResults = [];
    vm.arrayResults = [];
    vm.query = {
      order: 'Date',
      limit: 5,
      page: 1
    };
    vm.arrayExito = [];
    vm.arrayErrores = [];
    vm.mimeTypes =
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    vm.loadingCarga = false;
    vm.getResults = getResults;
    vm.cancelarCarga = cancelarCarga;
    vm.reader = new FileReader();
    vm.reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {type: 'binary'});
      workbook.SheetNames.forEach(function(sheetName) {
        vm.carga.file =
          XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      });
    };
    vm.reader.onerror = function(e) {
      rootScope.$broadcast(
        'event:toastMessage',
        'Hubo un error al leer el archivo, ' +
          'favor comunicarse con un Administardor.',
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
    vm.continuarCarga = continuarCarga;
    vm.finishCharge = finishCharge;

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

    function upTransactions(transactions) {
      cargaService.saveAccountTransaction(
        transactions,
        vm.currentCharge.id
      ).then(function(resultadoFilas) {
        console.log(resultadoFilas);
        vm.arrayExito = [];
        vm.arrayErrores = [];
        _.forEach(resultadoFilas, function(fila) {
          if (fila.status === 200) {
            vm.arrayExito.push(fila.data);
            var index = _.indexOf(vm.correctResults, {
              Date: fila.data.Date,
              Num: fila.data.Num,
              Name: fila.data.Name,
              Memo: fila.data.Memo,
              Account: fila.data.Account,
              Split: fila.data.Split,
              Amount: fila.data.Amount,
              TC: fila.data.TC,
              'Pesos Liabilities': fila.data.liabilities
            })
            /*
            if (index !== -1) {
              correctResults.splice(index, 1);
            }
            */
          } else {
            console.log(fila);
          }
        });
        vm.arrayErrores = vm.correctResults;
        rootScope.$broadcast('event:end-carga');
      });
    }

    function upCharge() {
      vm.carga.user = localStorage.getObject('currentUser');
      cargaService.generateHeader(vm.carga)
      .then(function(resultadoHeader) {
        console.log(resultadoHeader);
        if (resultadoHeader.status === 200) {
          vm.currentCharge = resultadoHeader.data;
          upTransactions(vm.correctResults);
        } else {
          rootScope.$broadcast(
            'event:toastMessage',
            'La carga no se ha podido llevar a cabo por falta de internet, ' +
              'favor revisar su conexión y volver a intentarlo.',
            'md-primary'
          );
        }
      }, function(error) {
        rootScope.$broadcast(
          'event:toastMessage',
          'La carga no se ha podido llevar a cabo por falta de internet, ' +
            'favor revisar su conexión y volver a intentarlo.',
          'md-primary'
        );
      });
    }

    function handleSubmitCarga() {
      vm.loadingCarga = true;
      vm.correctResults = vm.carga.file.map(function(value) {
        return {
          Date: value.Date || '',
          Num: value.Num || '',
          Name: value.Name || '',
          Memo: value.Memo || '',
          Account: value.Account || '',
          Split: value.Split || '',
          Amount: value.Amount || '0',
          TC: value.TC || '',
          'Pesos Liabilities': value['Pesos Liabilities'] || '0'
        }
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
            vm.filename = '';
            vm.searchProcess = false;
            vm.cargaForm.$setPristine();
            vm.cargaForm.$setUntouched();
            $mdDialog.hide(dialog);
          }, 1500);
        });
      });
    }

    function continuarCarga() {
      vm.searchProcessResult = false;
      vm.activarFinalizados = true;
    }

    function finishCharge() {
      vm.loadingFinish = true;
      console.log(vm.currentCharge);
      cargaService.finishCharge(vm.currentCharge.id)
      .then(function() {
        $timeout(function() {
          vm.searchProcessResult = false;
          vm.carga = angular.copy(oriCarga);
          vm.filename = '';
          vm.searchProcess = false;
          vm.cargaForm.$setPristine();
          vm.cargaForm.$setUntouched();
          rootScope.$broadcast(
              'event:toastMessage',
              'Carga finalizada con éxito.',
              'md-primary'
          );
          vm.loadingFinish = false;
        }, 1500);
      });
    }

    scope.$on('event:end-carga', function() {
      if (vm.arrayExito.length === 0) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Archivo no tiene filas válidas para la carga, ' +
            'favor revisarlo y volver a intentarlo.',
          'md-primary'
        );
      } else {
        rootScope.$broadcast(
          'event:toastMessage',
          'Archivo cargado, ' + vm.arrayExito.length +
            ' filas se cargaron con éxito.',
          'md-primary'
        );
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

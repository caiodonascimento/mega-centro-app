(function(){

  angular
    .module('app')
    .controller('CargaMovimientosController', [
      '$q', 'empresasService', '$rootScope', '$timeout', '$scope', 'cargaService',
      '$mdDialog', '$state', 'commonService', 'storageService', 'planCtaOriginService',
      CargaMovimientosController
    ]);

  function CargaMovimientosController($q, empresasService, rootScope, $timeout,
    scope, cargaService, $mdDialog, state, commonService, localStorage, planCtaOriginService) {
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
    vm.upload = upload;
    vm.colorResult = 'green-300';
    vm.selected = [];
    vm.correctResults = [];
    vm.arrayResults = [];
    vm.query = {
      order: 'Date',
      limit: 10,
      page: 1
    };
    vm.arrayExito = [];
    vm.arrayErrores = [];
    vm.mimeTypes =
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    vm.loadingCarga = true;
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
        vm.arrayResults = _.filter(vm.arrayExito, function(value, index) {
          var initIndex = (vm.query.page * vm.query.limit) - vm.query.limit;
          var endIndex = vm.query.page * vm.query.limit;
          return index >= initIndex && index < endIndex;
        })
      );
    }
    function querySearchEmpresa(query) {
      var defer = $q.defer();
      empresasService.loadAllEmpresas()
      .then(function (response) {
        defer.resolve(response.data);
      }, function (error) {
          defer.reject([]);
      });
      return defer.promise;
    }
    function upTransactions(transactions, arrayCuentasOrigen) {
      vm.arrayExito = [];
      vm.arrayErrores = [];
      planCtaOriginService.findManyByAccount(arrayCuentasOrigen)
      .then(function(data) {
        console.log(data);
        transactions = transactions.map(function(value) {
          var originAccount = _.findWhere(data, {account: value.onlyAccount});
          if (originAccount) {
            if (originAccount.chileanAccount.enterpriseId === vm.carga.empresa.id) {
              value.originAccountId = originAccount.id;
            } else {
              value.originAccountId = 0;
            }
          } else {
            value.originAccountId = 0;
          }
          return value;
        });
        cargaService.saveAccountTransaction(
          transactions,
          vm.currentCharge.id
        ).then(function(resultadoFilas) {
          _.forEach(resultadoFilas, function(fila, index) {
            if (fila.status === 200) {
              vm.arrayExito.push(vm.correctResults[index]);
            } else {
              vm.arrayErrores.push(vm.correctResults[index]);
            }
          });
          rootScope.$broadcast('event:end-carga');
        });
      });
    }
    function upCharge(arrayCuentasOrigen) {
      vm.carga.user = localStorage.getObject('currentUser');
      vm.carga.year = vm.year;
      cargaService.generateHeader(vm.carga)
      .then(function(resultadoHeader) {
        if (resultadoHeader.status === 200) {
          vm.currentCharge = resultadoHeader.data;
          upTransactions(vm.correctResults, arrayCuentasOrigen);
        } else {
          rootScope.$broadcast(
            'event:toastMessage',
            'La carga ha terminado con errores porque ha fallado la conexió a internet, ' +
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
      vm.arrayErrores = [];
      vm.year = 0;
      var arrayCuentasOrigen = [];
      vm.correctResults = vm.carga.file.map(function(value) {
        var fecha = new Date(value.Date);
        if (!_.isDate(fecha)) {
          vm.arrayErrores.push(value);
        }
        if (_.isDate(fecha) && vm.year !== 0) {
          vm.year = fecha.getFullYear() === vm.year ? vm.year : -1;
        }
        if (_.isDate(fecha) && vm.year === 0) {
          vm.year = fecha.getFullYear();
        }
        var dataAcount = value.Account ? value.Account.split('·') : [];
        if (dataAcount.length > 1) {
          arrayCuentasOrigen.push(dataAcount[0].replace(/^\s+|\s+$/gm,''));
        }
        return {
          Date: value.Date,
          Num: value.Num || '',
          Name: value.Name || '',
          Memo: value.Memo || '',
          Account: value.Account || '',
          onlyAccount: dataAcount.length > 1 ? dataAcount[0].replace(/^\s+|\s+$/gm,'') : 0,
          Split: value.Split || '',
          Amount: value.Amount || '0',
          TC: value.TC || '',
          'Pesos Liabilities': value['Pesos'] || '0'
        }
      });
      if (vm.year === 0 || vm.year === -1) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Favor revisar columna Date del archivo, ' +
            'ya que solo no se puede cargar datos de dos o mas años juntos.',
          'md-primary'
        );
        vm.loadingCarga = false;
        return false;
      }
      if (vm.arrayErrores.length > 0) {
        rootScope.$broadcast(
          'event:toastMessage',
          'Columna Date es inválida.',
          'md-primary'
        );
        vm.loadingCarga = false;
        return false;
      }
      arrayCuentasOrigen = _.uniq(arrayCuentasOrigen);
      upCharge(arrayCuentasOrigen);
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
      cargaService.cancelCharge(vm.currentCharge.id)
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
        }, 1500);
      });
    }
    function continuarCarga() {
      rootScope.$broadcast(
        'event:toastMessage',
        'Archivo cargado, ' + vm.arrayExito.length +
          ' filas se cargaron con éxito.',
        'md-primary'
      );
      vm.arrayErrores = [];
      vm.activarFinalizados = true;
    }
    function finishCharge() {
      vm.loadingFinish = true;
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
        if (vm.arrayErrores.length === 0) {
          rootScope.$broadcast(
            'event:toastMessage',
            'Archivo cargado, ' + vm.arrayExito.length +
              ' filas se cargaron con éxito.',
            'md-primary'
          );
        }
        vm.searchProcess = true;
      }
      vm.loadingCarga = false;
    });

    querySearchEmpresa().then(function(response) {
      vm.empresas = response;
      vm.loadingCarga = false;
    });
  }
})();

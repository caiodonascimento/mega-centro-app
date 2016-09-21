(function(){

  angular
       .module('app')
       .controller('EmpresaController', [
          EmpresaController
       ])
       .controller('NuevaEmpresaController', [
          NuevaEmpresaController
       ]);

  function EmpresaController() {
    var vm = this;

    vm.tableData = [
      {
        id: 3124,
        name: 'Mega 1',
        codeSoftalnd: 'M001000'
      },
      {
        id: 3125,
        name: 'Mega 2',
        codeSoftalnd: 'M002000'
      },
      {
        id: 3126,
        name: 'Mega 3',
        codeSoftalnd: 'M003000'
      },
      {
        id: 3124,
        name: 'Mega 1',
        codeSoftalnd: 'M001000'
      },
      {
        id: 3125,
        name: 'Mega 2',
        codeSoftalnd: 'M002000'
      },
      {
        id: 3126,
        name: 'Mega 3',
        codeSoftalnd: 'M003000'
      },
      {
        id: 3124,
        name: 'Mega 1',
        codeSoftalnd: 'M001000'
      },
      {
        id: 3125,
        name: 'Mega 2',
        codeSoftalnd: 'M002000'
      },
      {
        id: 3126,
        name: 'Mega 3',
        codeSoftalnd: 'M003000'
      }
    ];
  }

  function NuevaEmpresaController() {
    var vm = this;
    
  }

})();

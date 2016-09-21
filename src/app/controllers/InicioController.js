(function(){

  angular
       .module('app')
       .controller('InicioController', [
          InicioController
       ]);

  function InicioController() {
    var vm = this;

    vm.dataImg = 'https://www.travelexcellence.com/images/movil/La_Paz_Waterfall.jpg';
  }

})();

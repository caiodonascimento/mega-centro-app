(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        "name": "Inicio",
        "icon": "dashboard",
        "sref": ".inicio"
      },
      {
        "name": "Usuarios",
        "icon": "group",
        "sref": ".usuarios"
      },
      {
        "name": "Empresas",
        "icon": "business",
        "sref": ".empresas"
      },
      {
        "name": "Plan Cta. Chile",
        "icon": "account_balance_wallet",
        "sref": ".plan-chile"
      },
      {
        "name": "Plan Cta. Origen",
        "icon": "compare_arrows",
        "sref": ".plan-origen"
      },
      {
        "name": "Carga Movimientos",
        "icon": "file_upload",
        "sref": ".carga-movimientos"
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();

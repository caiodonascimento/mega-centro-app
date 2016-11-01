(function(){
  'use strict';

  angular.module('app')
      .service('commonService', [
          commonService
      ]);

  function commonService() {
    return {
      getYears: function() {
        var array = [];
        var yearInit = parseInt((new Date()).getFullYear()) - 3;
        var yearFinish = parseInt((new Date()).getFullYear());
        for (var intervalo = 0; intervalo <= yearFinish - yearInit; intervalo++) {
          array.push({
            id: yearInit + intervalo,
            name: (yearInit + intervalo).toString(),
            selected: yearInit + intervalo === yearFinish
          });
        }
        return array;
      },
      getMonths: function() {
        return [
          {
            id: 1,
            name: 'Enero',
            selected: true
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
      }
    }
  }
})();

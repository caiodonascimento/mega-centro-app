(function(){
  'use strict';

  angular.module('app')
    .constant('formatosImputs', {
      formLogin: {
        email: {
          pattern: '^[A-Za-z\\d\\.\\-\\_\\@]+$',
          format: '^(?!.*\\.\\.)("[!-~ ]+"|[0-9A-Z!#-\'*-\\/=?^-~]+)@((?![-])[A-Za-z0-9-]*[A-Za-z-]+[A-Za-z0-9-]*(?![-])\\.*)+\\.[a-z]+$',
          maxlength: 30
        },
        password: {
          pattern: '^[A-Za-z\\d\\.\\,\\-\\_\\:\\;\\!\\¡\\?\\¿]+$',
          maxlength: 15
        }
      },
      formEmpresa: {
        nombre: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 30
        },
        codigo: {
          pattern: '^[A-Za-z\\d]+$',
          maxlength: 30
        }
      },
      formEditar: {
        nombre: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 30
        },
        codigo: {
          pattern: '^[A-Za-z\\d]+$',
          maxlength: 30
        }
      }
    });
})();

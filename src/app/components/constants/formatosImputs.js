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
          pattern: '^[A-Za-z\d\.,-_:;!¡?¿*+]+$',
          maxlength: 15
        }
      },
      formUsuario: {
        alias: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 50
        },
        nombre: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 50
        },
        apellido: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 50
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
      },
      formPlanChile: {
        account: {
          pattern: '^[0-9]+$',
          maxlength: 20
        },
        name: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level1: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level2: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level3: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        }
      },
      formEditarPlanChile: {
        account: {
          pattern: '^[0-9]+$',
          maxlength: 20
        },
        name: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level1: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level2: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        },
        level3: {
          pattern: '^[A-Za-z\\s]+$',
          maxlength: 50
        }
      }
    });
})();

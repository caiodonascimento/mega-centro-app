(function(){
  'use strict';

  angular.module('app')
    .constant('formatosImputs', {
      formLogin: {
        email: {
          pattern: '^[A-Za-zñÑ\\d\\.@!#\\$%&\\\'*+-/=?\\^_`{|}~]+$',
          format: '^(?!.*\\.\\.)("[!-~ ]+"|[0-9A-Z!#-\'*-\\/=?^-~]+)@((?![-])[A-Za-z0-9-]*[A-Za-z-]+[A-Za-z0-9-]*(?![-])\\.*)+\\.[a-z]+$',
          maxlength: 30
        },
        password: {
          pattern: '^[A-Za-z\\d\\.!"#$%&\\\'()*+,-/:;?@[\\\]^_`{|}~]+$',
          maxlength: 15
        }
      },
      formUsers: {
        username: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\d\\.\\,\\:\\;\\-\\_\\!\\¡\\?\\¿\\$\\&\\%]+$',
          maxlength: 30
        },
        email: {
          pattern: '^[A-Za-z\\d\\.\\-\\_\\@]+$',
          maxlength: 30
        },
        name: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s]+$',
          maxlength: 50
        },
        lastName: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s]+$',
          maxlength: 50
        },
        password: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\d\\.\\,\\:\\;\\-\\_\\!\\¡\\?\\¿\\$\\&\\%]+$',
          maxlength: 15
        },
        rewritePassword: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\d\\.\\,\\:\\;\\-\\_\\!\\¡\\?\\¿\\$\\&\\%]+$',
          maxlength: 15
        }
      },
      formEmpresa: {
        nombre: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\d\\s\\.\\-\\_\\!\\¡\\\'\\"]+$',
          maxlength: 30
        },
        codigo: {
          pattern: '^[A-Z\\d]+$',
          maxlength: 30
        }
      },
      formLevel: {
        name: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s]+$',
          maxlength: 50
        },
        description: {
          pattern: '^[A-Za-záéíóúñÁÉÍÓÚÑ\\s\\-\\_\\.\\,]+$',
          maxlength: 50
        },
        type: {
          pattern: '^[0-9]+$',
          maxlength: 50
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

(function(){
  'use strict';

  angular.module('app')
    .constant('formatosImputs', {
      formLogin: {
        email: {
          pattern: '^[A-Za-z\\d\\.\\-\\_\\!\\¡\\?\\¿]+$',
          maxlength: 30
        },
        password: {
          pattern: '^[A-Za-z\\d\\.\\-\\_\\!\\¡\\?\\¿]+$',
          maxlength: 30
        }
      }
    });
})();

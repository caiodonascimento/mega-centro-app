(function(){
	'use strict';

	angular.module('app')
        .service('authService', [
        '$q', '$http', 'apiRoutes',
        authService
	]);

	function authService($q, $http, apiRoutes) {
		return {
			login : function(user) {
        var defer = $q.defer();
        $http.post(
          apiRoutes.usuarios.login + '?include=user',
          {
            email: user.email,
            password: user.password,
            ttl: 2000
          }
        ).then(function(response) {
          console.log(response);

        })
        .catch(function(error) {
          console.log(error);
          defer.reject(error);
        });
        return defer.promise;
			},
			logout : function() {
				empresa.id = empresas.length + 1;
				empresas.push(empresa);
			}
		};
	}
})();

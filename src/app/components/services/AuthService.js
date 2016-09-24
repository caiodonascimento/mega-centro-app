(function(){
	'use strict';

	angular.module('app')
        .service('authService', [
        '$q',
				'$http',
        '$localStorage',
        authService
	]);

	function authService($q, $http, localStorage) {
		return {
			login : function(usuario) {
        var data = {
          'email': usuario.email,
          'password': usuario.password
        };
				return $q.when(
					$http.post('https://megacentroapi-mosschile.rhcloud.com/api/Users/login', data)
				);
			},
      getUser : function(id) {
        var params = id.toString() + '?access_token=' + localStorage.accessToken;
        return $q.when(
					$http.get('https://megacentroapi-mosschile.rhcloud.com/api/Users/' + params)
				);
      },
			logout : function(empresa) {
        var data = {
          'email': usuario.email,
          'password': usuario.password
        };
				return $q.when(
					$http.post('https://megacentroapi-mosschile.rhcloud.com/api/Users/logout', data)
				);
			}
		};
	}
})();

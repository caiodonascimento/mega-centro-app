(function(){
	'use strict';

	angular.module('app')
        .service('authService', [
        '$q', '$http', '$localStorage', 'apiRoutes',
        authService
	]);

	function authService($q, $http, localStorage, apiRoutes) {
		return {
			login : function(usuario) {
        var data = {
          'email': usuario.email,
          'password': usuario.password
        };
				return $q.when(
					$http.post(
						apiRoutes.usuarios + '/login',
						data,
						{
							params: {
								'include': 'user'
							}
						}
					)
				);
			},
      getUser : function(id) {
        var params = id.toString();
        return $q.when(
					$http.get(
						apiRoutes.usuarios + '/' + params,
						{
							header: {
								'Authorization': localStorage.accessToken
							}
						}
					)
				);
      },
			logout : function() {
				var token = localStorage.accessToken;
				localStorage.$reset();
				if (token) {
					$http.post(
						apiRoutes.usuarios + '/logout',
						{},
						{
							params: {
								'access_token': token
							}
						}
					);
				}
			},
			verifyUser: function() {
				if (localStorage.accessToken && localStorage.currentUser) {
					return true;
				}
				return false;
			}
		};
	}
})();

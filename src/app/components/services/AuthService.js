(function(){
	'use strict';

	angular.module('app')
        .service('authService', [
        '$q', '$http', 'storageService', 'apiRoutes',
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
      getCurrentUser : function() {
				var currentUser = localStorage.getObject('currentUser');
				if (!currentUser) {
					return $q.when({});
				} else {
					var params = currentUser.id.toString();
	        return $q.when(
						$http.get(
							apiRoutes.usuarios + '/' + params,
							{
								headers: {
									'Authorization': localStorage.get('accessToken')
								}
							}
						)
					);
				}
      },
			logout : function() {
				var token = localStorage.get('accessToken');
				localStorage.clearAll();
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
				var token = localStorage.get('accessToken');
				var currentUser = localStorage.getObject('currentUser');
				if (token && currentUser !== {}) {
					return true;
				}
				return false;
			}
		};
	}
})();

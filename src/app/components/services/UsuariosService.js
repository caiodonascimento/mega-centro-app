(function(){
	'use strict';

	angular.module('app')
        .service('usuariosService', [
        '$q', '$http', 'apiRoutes', 'storageService',
        usuariosService
	]);

	function usuariosService($q, $http, apiRoutes, localStorage) {
		return {
			loadAllUsuarios : function() {
				return $q.when(
					$http.get(
						apiRoutes.usuarios,
						{
              headers: {
                'Authorization': localStorage.get('accessToken')
              },
							params: {
								'filter[where][status]': 0
							}
						}
					)
				);
			},
			insertUsuario : function(usuario) {
				var now = new Date();
				var data = {
					name: usuario.name,
		      lastName: usuario.lastName,
		      role: usuario.role,
		      username: usuario.username,
		      email: usuario.email,
				  status: 0,
				  createDate: now.toString()
				};
				return $q.when(
					$http.post(
						apiRoutes.usuarios,
						data,
            {
              headers: {
                'Authorization': localStorage.get('accessToken')
              }
            }
					)
				);
			},
			updateUsuario : function(usuario) {
				var data = {
					name: usuario.name,
		      lastName: usuario.lastName,
		      role: usuario.role,
		      username: usuario.username,
		      email: usuario.email
				};
				return $q.when(
					$http.put(
						apiRoutes.usuarios + '/' + usuario.id.toString(),
						data,
            {
              headers: {
                'Authorization': localStorage.get('accessToken')
              }
            }
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						apiRoutes.usuarios + '/' + id,
            {
              headers: {
                'Authorization': localStorage.get('accessToken')
              }
            }
					)
				);
			},
			deleteUsuario : function(usuario) {
				var data = {
					status: 1
				};
				return $q.when(
					$http.put(
						apiRoutes.usuarios + '/' + usuario.id.toString(),
						data,
            {
              headers: {
                'Authorization': localStorage.get('accessToken')
              }
            }
					)
				);
			}
		};
	}
})();

(function(){
	'use strict';

	angular.module('app')
        .service('usuariosService', [
        '$q', '$http', 'apiRoutes', 'cypherService', 'appConfig',
        usuariosService
	]);

	function usuariosService($q, $http, apiRoutes, cypherService, CONFIG) {
		return {
			loadAllUsuarios : function() {
				return $q.when(
					$http.get(
						apiRoutes.usuarios,
						{
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
				  createDate: now.toString(),
					password: cypherService.encode(CONFIG.secret, usuario.password)
				};
				return $q.when(
					$http.post(
						apiRoutes.usuarios,
						data
					)
				);
			},
			updateUsuario : function(usuario, changePass) {
				var data = {
					name: usuario.name,
		      lastName: usuario.lastName,
		      role: usuario.role,
		      username: usuario.username,
		      email: usuario.email
				};
				if (changePass) {
					data.password = cypherService.encode(CONFIG.secret, usuario.password);
				}
				return $q.when(
					$http.put(
						apiRoutes.usuarios + '/' + usuario.id.toString(),
						data
					)
				);
			},
			getById : function(id) {
				return $q.when(
					$http.get(
						apiRoutes.usuarios + '/' + id
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
						data
					)
				);
			}
		};
	}
})();

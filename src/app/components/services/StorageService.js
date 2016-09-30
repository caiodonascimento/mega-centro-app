(function(){
	'use strict';

	angular.module('app')
        .service('storageService', [
        '$q', '$window',
        storageService
	]);

	function storageService($q, $window) {
		return {
      set: function (key, value) {
        var deferred = $q.defer();
        if (!_.isUndefined(key) && !_.isUndefined(value)){
          $window.localStorage[key] = value;
        }
        deferred.resolve(1);
        return deferred.promise;
      },
      get: function (key, defaultValue) {
        if ( !$window.localStorage[key] ) {
          $window.localStorage[key] = "";
        }
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      remove: function (key) {
        if ( !$window.localStorage[key] ) return;
        $window.localStorage.removeItem(key);
        return;
      },
      clearAll: function () {
        return $window.localStorage.clear();
      }
		};
	}
})();

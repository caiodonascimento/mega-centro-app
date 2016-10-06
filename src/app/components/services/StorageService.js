(function(){
	'use strict';

	angular.module('app')
        .service('storageService', [
        '$q', '$window',
        storageService
	]);

	function storageService($q, $window, $crypto) {
		var mySerializer = function (value) {
			//return $crypto.encrypt(value);
			return value;
    };
    var myDeserializer = function (value) {
      //return $crypto.decrypt(value);
			return value;
    };
		return {
      set: function (key, value) {
        var deferred = $q.defer();
        if (!_.isUndefined(key) && !_.isUndefined(value)){
					key = mySerializer(key);
					value = mySerializer(value);
          $window.localStorage[key] = value;
        }
        deferred.resolve(1);
        return deferred.promise;
      },
      get: function (key, defaultValue) {
				key = mySerializer(key);
        if (!$window.localStorage[key]) {
          $window.localStorage[key] = "";
        }
        return myDeserializer($window.localStorage[key]) || defaultValue;
      },
      setObject: function (key, value) {
				key = mySerializer(key);
        $window.localStorage[key] = mySerializer(JSON.stringify(value));
      },
      getObject: function (key) {
				key = mySerializer(key);
        return JSON.parse(myDeserializer($window.localStorage[key]) || '{}');
      },
      remove: function (key) {
				key = mySerializer(key);
        if (!$window.localStorage[key]) return;
        $window.localStorage.removeItem(key);
        return;
      },
      clearAll: function () {
        return $window.localStorage.clear();
      }
		};
	}
})();

(function(){
	'use strict';

	angular.module('app')
        .service('storageService', [
        '$q', '$window', 'cypherService', 'appConfig',
        storageService
	]);

	function storageService($q, $window, cypherService, CONFIG) {
		var encrypt = function(value) {
      return _.isString(value) && value !== "" ? cypherService.encode(CONFIG.secret, value) : value;
    };
    var decrypt = function(value) {
      return _.isString(value) && value !== "" ? cypherService.decode(CONFIG.secret, value) : value;
    };
    var _toggleEncryption = function(obj, reverse) {
      _.each(obj, function(value, key){
        if (reverse) {
          obj[decrypt(key)] = _.isObject(value) ? _toggleEncryption(value, reverse) : decrypt(value) ;
        } else {
          obj[encrypt(key)] = _.isObject(value) ? _toggleEncryption(value, reverse) : encrypt(value) ;
        }
        if (_.isString(key)) delete obj[key];
      });
      return obj;
    };
    var encryptObject = function(obj) {
      return _toggleEncryption(obj, false);
    };
    var decryptObject = function(obj) {
      return _toggleEncryption(obj, true);
    };
    return {
      set: function(key, value) {
        if (!_.isUndefined(key) && !_.isUndefined(value)){
          $window.localStorage[encrypt(key)] = encrypt(value);
        }
        return true;
      },
      get: function(key, defaultValue) {
        var valueEncrypted = $window.localStorage[encrypt(key)];
        var isInt = parseInt(valueEncrypted);
        var isBoolean = _.contains(["true", "false"], valueEncrypted);
        var valueDecrypted;
        if (isInt) {
          valueDecrypted = valueEncrypted.indexOf(".") >= 0 ? parseFloat(valueEncrypted) : isInt;
        } else{
          if (isBoolean) {
            valueDecrypted = valueEncrypted == "true" ? true : false;
          } else {
            valueDecrypted = decrypt(valueEncrypted);
          }
        }
        return valueDecrypted || defaultValue;
      },
      setObject: function(key, objectToSet) {
        if (_.isEmpty(objectToSet)){
          service.remove(key);
          return false;
        }
        $window.localStorage[encrypt(key)] = JSON.stringify(encryptObject(angular.copy(objectToSet)));
        return true;
      },
      getObject: function(key) {
        var objectEncrypted = JSON.parse(angular.copy($window.localStorage[encrypt(key)]) || '{}');
        return decryptObject(objectEncrypted);
      },
      remove: function(key) {
        if ( !$window.localStorage[encrypt(key)] ) return;
        $window.localStorage.removeItem(encrypt(key));
        return;
      },
      clearAll: function() {
        return $window.localStorage.clear();
      }
    };
	}
})();

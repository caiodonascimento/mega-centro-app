(function() {
    'use strict';

    angular
        .module('app')
        .directive('caracterRestrict', caracterRestrictDirective);

    function caracterRestrictDirective() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link : function(scope, element, attrs, ngModel) {
              attrs.$set('ngTrim', 'false');
              var aceptedCaracters = RegExp(attrs.caracterRestrict);
              scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue === undefined) return;
                if (newValue !== '' && !aceptedCaracters.test(newValue)) {
                  ngModel.$setViewValue(oldValue);
                  ngModel.$render();
                }
              });
            }
        };
    }
})();

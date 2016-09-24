(function() {
    'use strict';

    angular
        .module('app')
        .directive('limitCaracter', limitCaracterDirective);

    function limitCaracterDirective() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link : function(scope, element, attrs, ngModel) {
              attrs.$set('ngTrim', 'false');
              var limit = parseInt(attrs.limitCaracter, 0);
              scope.$watch(attrs.ngModel, function(newValue) {
                if (typeof ngModel.$viewValue === 'string' && newValue !== 'undefined') {
                  if(ngModel.$viewValue.length > limit){
                    ngModel.$setViewValue(ngModel.$viewValue.substring(0, limit));
                    ngModel.$render();
                  }
                }
              });
            }
        };
    }
})();

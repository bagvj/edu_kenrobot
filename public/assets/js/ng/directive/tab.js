'use strict';
angular.module('kenrobot')
  .directive('tab', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'assets/views/components/tab.html',
      require: '^tabset',
      scope: {
        heading: '=',
        icon: '=',
        iconSize: '=',
        callback: '='
      },
      link: function(scope, elem, attr, tabsetCtrl) {
        scope.active = false;
        scope.disabled = false;
        if (attr.disable) {
          attr.$observe('disable', function(value) {
            scope.disabled = (value !== 'false');
          });
        }
        tabsetCtrl.addTab(scope);
      }
    };
  });
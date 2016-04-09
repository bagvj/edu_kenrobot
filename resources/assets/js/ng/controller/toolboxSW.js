'use strict';

/**
 * @ngdoc function
 * @name kenrobot.controller:toolboxSW
 * @description
 * # toolboxSW
 * Controller of the kenrobot
 */
angular.module('kenrobot')
  .controller('toolboxSW', function($scope, $http, common) {
    $http.get('/assets/res/menus/swtoolbox.json').success(function(res) {
    	$scope.swToolboxMenu = res;
    });
  });
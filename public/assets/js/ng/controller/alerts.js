'use strict';
angular.module('kenrobot')
	.controller('AlertsCtrl', function($scope, alertsService) {
		$scope.alerts = alertsService.getInstance();
		$scope.generateSvgUrl = function(id) {
			return '/assets/images/sprite.svg#' + id;
		};
	});
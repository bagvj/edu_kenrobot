'use strict';
angular.module('kenrobot')
	.controller('AlertController', function($scope, alertsService) {
		$scope.alerts = alertsService.getInstance();
		$scope.generateSvgUrl = function(id) {
			return '/assets/image/sprite.svg#' + id;
		};
	});
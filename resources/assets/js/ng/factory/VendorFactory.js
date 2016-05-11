'use strict';
angular.module('kenrobot')
	.factory('_', function($window) {
		return $window._;
	})
	.factory('jsPlumb', function($window) {
		return $window.jsPlumb;
	});
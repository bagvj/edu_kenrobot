'use strict';
angular.module('kenrobot')
	.controller('ApiController', function($scope, projectApi){

		function hasChanged(callback) {
			var project = $scope.getCurrentProject();
			var changed = projectApi.hasChanged(project);
			callback(changed, project);
		};

		function setProjectInfo(info) {
			$scope.project.info = info;
			projectApi.oldProject = $scope.project;
			projectApi.projectChanged = false;
		}

		var api = {
			hasChanged: hasChanged,
			setProjectInfo: setProjectInfo,
		};

		$scope.getApi = function() {
			return api;
		}
	});
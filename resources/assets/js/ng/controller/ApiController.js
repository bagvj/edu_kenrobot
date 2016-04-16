'use strict';
angular.module('kenrobot')
	.controller('ApiController', function($scope, $route, $rootScope, projectApi, hw2Bloqs, bloqs) {

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

		function getProject() {
			return $scope.getCurrentProject();
		}

		function setProject(project) {
			var hasProp = false;
			for(var prop in project) {
				hasProp = true;
				break;
			}
			if(hasProp) {
				$scope.setProject(project);
				projectApi.projectChanged = false;

				hw2Bloqs.repaint();
				$scope.refreshCode();
				$scope.$apply();
				$rootScope.$emit('refreshScroll');
			} else {
				resetProject();
			}
		}

		function resetProject() {
			if ($scope.arduinoMainBloqs.varsBloq) {
				bloqs.removeBloq($scope.arduinoMainBloqs.varsBloq.uuid, true);
				$scope.arduinoMainBloqs.varsBloq = null;
				bloqs.removeBloq($scope.arduinoMainBloqs.setupBloq.uuid, true);
				$scope.arduinoMainBloqs.setupBloq = null;
				bloqs.removeBloq($scope.arduinoMainBloqs.loopBloq.uuid, true);
				$scope.arduinoMainBloqs.loopBloq = null;
			}
			$route.reload();
		}

		var api = {
			hasChanged: hasChanged,
			setProjectInfo: setProjectInfo,
			getProject: getProject,
			setProject: setProject,
			resetProject: resetProject,
		};

		$scope.getApi = function() {
			return api;
		}
	});
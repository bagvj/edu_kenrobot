'use strict';
angular.module('kenrobot')
	.controller('ApiController', function($scope, $route, $timeout, $location, $rootScope, projectApi, hw2Bloqs, bloqs) {

		function hasChanged(callback) {
			var project = getProject();
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

		function loadProject(project) {
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
				$rootScope.$emit('refreshScroll');
			} else {
				resetProject();
			}
		}

		function resetProject() {
			console.log("resetProject");
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

		function reload() {
			console.log("reload");
			$location.path('/').replace();
		}

		var api = {
			hasChanged: hasChanged,
			setProjectInfo: setProjectInfo,
			getProject: getProject,
			loadProject: loadProject,
			resetProject: resetProject,
			reload: reload,
		};

		$scope.getApi = function() {
			return api;
		}
	});
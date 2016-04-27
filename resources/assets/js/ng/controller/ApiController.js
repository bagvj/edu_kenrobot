'use strict';
angular.module('kenrobot')
	.controller('ApiController', function($scope, $route, $timeout, $location, $rootScope, $window, projectApi, hw2Bloqs, bloqs) {

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
				$rootScope.$emit('refreshScroll');
			} else {
				resetProject();
			}

			$timeout(function() {
				$rootScope.$apply();
			}, 100);
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

		function reload() {
			$location.path('/').replace();
			$rootScope.$apply();
		}

		var api = {
			getProject: getProject,
			setProject: setProject,
			resetProject: resetProject,
			reload: reload,
		};

		$scope.getApi = function() {
			return api;
		}
	});
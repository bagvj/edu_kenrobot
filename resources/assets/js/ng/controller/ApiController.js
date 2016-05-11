'use strict';
angular.module('kenrobot')
	.controller('ApiController', function($scope, $route, $timeout, $location, $rootScope, $window, hw2Bloqs, bloqs) {

		function getProject() {
			return $scope.getCurrentProject();
		}

		function setProject(project) {
			project = project || {};
			var hasProp = false;
			for(var key in project) {
				hasProp = true;
				break;
			}

			project = hasProp ? project : $scope.getDefaultProject();

			$scope.setProject(project);
			hw2Bloqs.repaint();
			$scope.refreshCode();
			$rootScope.$emit('refreshScroll');
			$rootScope.$apply();
		}

		function reload() {
			$location.path('/').replace();
			$rootScope.$apply();
		}

		var api = {
			getProject: getProject,
			setProject: setProject,
			reload: reload,
		};

		$scope.getApi = function() {
			return api;
		}
	});
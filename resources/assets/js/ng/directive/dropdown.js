'use strict';
angular.module('kenrobot')
	.directive('dropdown', function($parse, $timeout, $filter) {
		return {
			restrict: 'E',
			templateUrl: 'assets/views/components/dropdown.html',
			scope: {
				optionsClick: '=',
				tree: '='
			},
			controllerAs: 'dropdown',
			controller: function($scope, $element, $attrs, common) {
				var self = this;
				self.activeMenu = null;

				self.select = function(menu) {
					if (self.activeMenu === menu) {
						self.activeMenu = null;
					} else {
						self.activeMenu = menu;
					}
				};

				self.changeTitle = function(item) {
					if ($scope.tree.languages) {
						var translate = $filter('translate');
						$scope.tree.languages.name = translate(item.name);
						common.translateTo(item.name);
					}
				};

				self.closeDropdown = function() {
					$timeout(function() {
						self.activeMenu = null;
					}, 0);
				};

				$(document).on('click', function() {
					if ($(event.target).closest('dropdown').length > 0) {
						return false;
					}
					self.closeDropdown();
				});
			}
		};
	});
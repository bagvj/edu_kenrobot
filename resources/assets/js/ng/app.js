'use strict';
angular.module('kenrobot', [
		'ngRoute',
		'ngSanitize',
		'pascalprecht.translate',
		'ngDialog'
	]).config(function($routeProvider, $translateProvider, langProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'assets/views/main.html'
			})
			.when('/project/:hash', {
				templateUrl: 'assets/views/main.html'
			})
			.when('/action/:action', {
				templateUrl: 'assets/views/main.html'
			})
			.otherwise({
				redirectTo: '/'
			});

		var lang = langProvider.$get();
		$translateProvider
			.useSanitizeValueStrategy('escaped')
			.translations('zh', lang.zh)
			.preferredLanguage('zh');
	})
	.run(function(_, bloqs, $rootScope, $location, $routeParams) {
		var pathRegex = /(project\/([0-9a-zA-Z]{6})$)|(action\/([0-9a-zA-Z]+)$)/;
		$rootScope.$on('$locationChangeStart', function(e, next, current) {
			if (!pathRegex.test(next)) {
				$location.path('/').replace();
			}
		});

		$rootScope.$on('$routeChangeSuccess', function(e) {
			$rootScope.$emit('onRouteChange', $routeParams);
		});
		
		bloqs.setOptions({
			lang: 'zh',
			forcedScrollTop: 0,
			fieldOffsetLeft: 66,
			fieldOffsetTopForced: 66,
		});
	});
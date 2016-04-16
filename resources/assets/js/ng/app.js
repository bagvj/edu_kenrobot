'use strict';
angular
	.module('kenrobot', [
		'ngRoute',
		'ngSanitize',
		'pascalprecht.translate',
		'ngDialog'
	]).config(function($routeProvider, $translateProvider, langProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/assets/views/bloqs-project.html'
			})
			.when('/project/:hash', {
				templateUrl: '/assets/views/bloqs-project.html'
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
		$rootScope.$on('$locationChangeStart', function(e, next, current) {
			var path = /project\/([0-9a-zA-Z]{6}).*/i.exec(next);
			if (!path || !path[1]) {
				$location.path('/').replace();
			}
		});

		$rootScope.$on('$routeChangeSuccess', function(e) {
			$rootScope.$emit('onRouteChange', $routeParams);
		});
		
		bloqs.setOptions({
			lang: 'zh',
			forcedScrollTop: 0
		});
	});
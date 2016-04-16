'use strict';
angular
	.module('kenrobot', [
		'ngRoute',
		'ngSanitize',
		'pascalprecht.translate',
		'ngDialog'
	]).config(function($routeProvider, $translateProvider, $locationProvider, langProvider) {
		// $locationProvider.html5Mode(true);

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
			// .useSanitizeValueStrategy('sanitize')
			// .translations('en', lang.en)
			.translations('zh', lang.zh)
			.preferredLanguage('zh');
	})
	.run(function(_, bloqs, $rootScope, $routeParams) {
		console.log("aaaaa");
		function routeChangeSuccess(event) {
			
		}
		$rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

		bloqs.setOptions({
			lang: 'zh',
			// fieldOffsetLeft: 66,
			// fieldOffsetTopForced: 66,
			forcedScrollTop: 0
		});
	});
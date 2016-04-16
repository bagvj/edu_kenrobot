'use strict';
angular
    .module('kenrobot', [
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate',
        'ngDialog'
    ]).config(function($routeProvider, $translateProvider, $locationProvider, langProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: '/assets/views/bloqs-project.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    
        var lang = langProvider.$get();
        $translateProvider
            .useSanitizeValueStrategy('sanitize')
            .translations('en', lang.en)
            .translations('zh', lang.zh)
            .preferredLanguage('en')
            .fallbackLanguage('en');
    })
    .run(function(_, bloqs) {
        bloqs.setOptions({
            lang: 'en',
            // fieldOffsetLeft: 66,
            // fieldOffsetTopForced: 66,
            forcedScrollTop: 0
        });
    });
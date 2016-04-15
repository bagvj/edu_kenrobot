'use strict';

/**
 * @ngdoc overview
 * @name kenrobot
 * @description
 * # bitbloq-offline
 *
 * Main module of the application.
 */
angular
    .module('kenrobot', [
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate',
        'ngDialog'
    ]).config(['$routeProvider', '$translateProvider', '$locationProvider',
        function($routeProvider, $translateProvider, $locationProvider) {
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/bloqs-project.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
            
            $translateProvider.useStaticFilesLoader({
                prefix: '/assets/res/locales/',
                suffix: '.json'
            });

            //indicamos el idioma inicial
            $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
            $translateProvider.preferredLanguage('en-GB');
            $translateProvider.fallbackLanguage('en-GB');
        }
    ])
    .run(function(_, bloqs) {
        // Make sure _ is invoked at runtime. This does nothing but force the "_" to
        // be loaded after bootstrap. This is done so the "_" factory has a chance to
        // "erase" the global reference to the lodash library.
        bloqs.setOptions({
            fieldOffsetLeft: 48,
            fieldOffsetTopForced: 41,
            forcedScrollTop: 0
        });
    });
'use strict';
/**
 * @ngdoc function
 * @name bitbloqApp.controller:hardwareTabCtrl
 * @description
 * # hardwareTabCtrl
 * Controller of the components list
 */
angular.module('kenrobot')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('_', function($window) {
        // Get a local handle on the global lodash reference.
        var _ = $window._;
        // Return the [formerly global] reference so that it can be injected
        // into other aspects of the AngularJS application.
        return (_);
    });
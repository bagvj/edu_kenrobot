'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.utils
 * @description
 * # utils
 * Service in the bitbloqApp.
 */
angular.module('kenrobot')
    .service('nodeUtils', function() {
        var exports = {};

        exports.downloadFile = function(fileName, data, defaultExtension, callback) {
            var filePath = fileName;
            if (defaultExtension && filePath.indexOf('.') === -1) {
                filePath += defaultExtension;
            }
            callback(filePath);
        };

        return exports;
    });
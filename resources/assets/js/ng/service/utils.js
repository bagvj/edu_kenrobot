'use strict';
angular.module('kenrobot')
	.service('utils', function(_, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		var exports = {};

		exports.getDOMElement = function(selector) {
			var nodeList = document.querySelectorAll(selector);
			return (nodeList.length) ? nodeList[nodeList.length - 1] : null;
		};

		exports.prettyCode = function(code) {
			var pretty = '';

			//Prepare string to js_beautify
			function insertBeautyIgnores(match) {
				return '/* beautify ignore:start */' + match + '/* beautify ignore:end */';
			}

			//Remove beautify ignore & preserve sections
			pretty = js_beautify(code.replace(/(#include *.*)/gm, insertBeautyIgnores).replace(/(#define *.*)/gm, insertBeautyIgnores)).replace(/(\/\* (beautify)+ .*? \*\/)/gm, ''); // jshint ignore:line

			return pretty;
		};

		return exports;
	});
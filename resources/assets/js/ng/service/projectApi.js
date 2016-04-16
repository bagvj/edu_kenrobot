'use strict';
angular.module('kenrobot')
	.service('projectApi', function(_) {
		var exports = {};
		exports.oldProject = null;
		exports.projectChanged = false;
		
		exports.getCleanProject = function(projectRef) {
			var cleanProject = _.cloneDeep(projectRef);
			delete cleanProject.id;
			delete cleanProject._acl;
			delete cleanProject.creatorId;
			delete cleanProject.creatorUsername;
			delete cleanProject._createdAt;
			delete cleanProject._updatedAt;
			delete cleanProject.links;

			return cleanProject;
		};

		exports.hasChanged = function(project) {
			if (exports.oldProject && _.isEqual(project.hardware, exports.oldProject.hardware) && _.isEqual(project.software, exports.oldProject.software) && !exports.projectChanged) {
				return false;
			} else {
				return true;
			}
		};

		return exports;
	});
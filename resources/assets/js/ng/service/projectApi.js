'use strict';
angular.module('kenrobot')
	.service('projectApi', function(utils, common, _, alertsService) {
		var exports = {};
		exports.savedProjectPath = null;
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

		function download(projectRef, callback) {
			var project = exports.getCleanProject(projectRef),
				filename = utils.removeDiacritics(common.translate('new-project'));

			project.exportedFromBitbloqOffline = true;
			project.kenrobotVersion = common.version;
			project.bloqsVersion = common.bloqsVersion;

			// exports.savedProjectPath = path;
			// exports.oldProject = project;
			// exports.projectChanged = false;
			// callback(true);
		}

		exports.exportArduinoCode = function(componentsArray, arduinoMainBloqs) {
			var code = utils.prettyCode(bloqsUtils.getCode(componentsArray, arduinoMainBloqs)),
				filename = utils.removeDiacritics(common.translate('new-project'));

			// alertsService.add('make-saved-project', 'project-saved', 'ok', 3000);
			// exports.savedInoPath = path;
		};

		exports.save = function(projectRef, callback) {
			if (exports.savedProjectPath) {
				var project = exports.getCleanProject(projectRef);
				project.exportedFromBitbloqOffline = true;
				project.kenrobotVersion = common.version;

				//do save project

				exports.oldProject = project;
				exports.projectChanged = false;
				if (callback) {
					callback(true);
				}
			} else {
				download(projectRef, function() {
					if (callback) {
						callback(true);
					}
				});
			}
		};

		exports.saveAs = function(projectRef, callback) {
			download(projectRef, function() {
				if (callback) {
					callback(true);
				}
			});
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
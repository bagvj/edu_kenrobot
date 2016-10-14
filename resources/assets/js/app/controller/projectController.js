define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/emitor', 'app/model/userModel', 'app/model/projectModel', 'app/model/uploadModel', 'app/component/content/project', 'app/component/content/hardware', 'app/component/content/software', 'app/component/content/code'], function($1, appConfig, util, emitor, userModel, projectModel, uploadModel, project, hardware, software, code) {
	var currentProject;
	var tempProject;
	var myProjects;

	function init() {
		myProjects = [];

		emitor.on('app', 'start', onAppStart);
		emitor.on('user', 'login', onUserLogin);
		emitor.on('project', 'open', onProjectOpen);
		emitor.on('project', 'save', onProjectSave);
		emitor.on('project', 'edit', onProjectEdit);
		emitor.on('project', 'delete', onProjectDelete);
		emitor.on('project', 'upload', onProjectUpload);
		emitor.on('project', 'copy', onProjectCopy);
		emitor.on('code', 'refresh', onCodeRefresh);
		emitor.on('software', 'update-block', onSoftwareBlockUpdate);
	}

	function openProject(projectInfo) {
		projectInfo.id == 0 && (tempProject = projectInfo);
		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;
		myProjects.length == 0 && project.addProject(projectInfo);
		project.updateCurrentProject(projectInfo);

		var projectData = projectInfo.project_data;
		var board = projectData.hardware && projectData.hardware.board || "ArduinoUNO";
		project.setBoard(board);

		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);
	}

	function loadMyProject() {
		var promise = $.Deferred();

		projectModel.getAll().done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				promise.reject();
				return;
			}

			if (result.data.length == 0) {
				promise.reject();
				return;
			}

			result.data.forEach(function(projectInfo) {
				projectInfo = convertProject(projectInfo);
				myProjects.push(projectInfo);
			});
			promise.resolve();
		});

		return promise;
	}

	function onAppStart() {
		uploadModel.init(appConfig.chromeExt);

		projectModel.getSchema().done(function(result) {
			var schema = result.data;
			hardware.loadSchema(schema.hardware);
			software.loadSchema(schema.software);
			project.updateBoards(schema.hardware.boards);
		}).then(function() {
			userModel.authCheck().done(function() {
				loadMyProject().done(function() {
					project.updateList(myProjects);
					openProject(myProjects[0]);
				}).fail(function() {
					openProject(getDefaultProject());
				});
			}).fail(function() {
				openProject(getDefaultProject());
			});
		});
	}

	function onUserLogin() {
		loadMyProject().done(function() {
			project.updateList(myProjects, false);
		});
	}

	function onProjectOpen(id, force) {
		var info = getCurrentProject();
		if (!force && id == info.id) {
			return;
		}

		if (id == 0) {
			tempProject && openProject(tempProject);
			return;
		}

		var index = findProjectIndex(myProjects, id);
		if (index < 0) {
			return;
		}

		openProject(myProjects[index]);
	}

	function onProjectSave(projectInfo, saveType, newSave) {
		projectInfo = projectInfo || {};
		if (saveType == "edit") {
			//编辑
			if (projectInfo.id == 0) {
				saveType = "save";
				newSave = true;

				projectInfo.project_data = JSON.stringify(getProjectData());
			}
		} else if (saveType == "save") {
			//保存
			var info = getCurrentProject();
			if (!newSave && info.id == 0) {
				emitor.trigger('project', 'show', {
					data: info,
					type: 'save'
				});
				return;
			}

			projectInfo.id = info.id;
			projectInfo.project_data = JSON.stringify(getProjectData());
		} else {
			//新建
			projectInfo.project_data = "";
		}
		projectInfo.user_id = userModel.getUserId();

		projectModel.save(projectInfo).done(function(result) {
			result.status == 0 ? onProjectSaveSuccess(result.data.project_id, saveType, newSave) : util.message(result.message);
		});
	}

	function onProjectEdit(id) {
		var projectInfo;
		if (id == 0) {
			projectInfo = getCurrentProject();
		} else {
			var index = findProjectIndex(myProjects, id);
			index >= 0 && (projectInfo = myProjects[index]);
		}

		projectInfo && emitor.trigger('project', 'show', {
			data: projectInfo,
			type: 'edit'
		});
	}

	function onProjectDelete(id) {
		var projectInfo;
		if (id == 0) {
			projectInfo = getCurrentProject();
			projectInfo && emitor.trigger('common', 'show', {
				type: 'warn',
				content: '正在删除项目“' + projectInfo.project_name + '”。删除后不可恢复，确定要删除吗？',
				onConfirm: function() {
					util.message("删除成功");
					onProjectDeleteSuccess(id);
				},
			});
		} else {
			var index = findProjectIndex(myProjects, id);
			index >= 0 && (projectInfo = myProjects[index]);
			projectInfo && emitor.trigger('common', 'show', {
				type: 'warn',
				content: '正在删除项目“' + projectInfo.project_name + '”。删除后不可恢复，确定要删除吗？',
				onConfirm: function() {
					projectModel.remove(id).done(function(result) {
						util.message(result.message);
						result.status == 0 && onProjectDeleteSuccess(id);
					});
				},
			});
		}
	}

	function onProjectCopy(id) {
		var projectInfo;
		if (id == 0) {
			util.message("请先保存项目");
			return;
		}

		var index = findProjectIndex(myProjects, id);
		index >= 0 && (projectInfo = myProjects[index]);
		if (!projectInfo) {
			return;
		}

		var copyProjectInfo = $.extend({}, projectInfo);
		copyProjectInfo.id = 0;
		copyProjectInfo.user_id = userModel.getUserId();
		copyProjectInfo.project_name = copyProjectInfo.project_name + " - 副本";
		copyProjectInfo.project_data = JSON.stringify(copyProjectInfo.project_data);
		projectModel.save(copyProjectInfo).done(function(result) {
			result.status == 0 ? onProjectSaveSuccess(result.data.project_id, "copy") : util.message(result.message);
		});
	}

	function onProjectSaveSuccess(id, saveType, newSave) {
		projectModel.get(id).done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				return;
			}

			var projectInfo = convertProject(result.data);
			if (saveType == "new") {
				myProjects.unshift(projectInfo);
				project.addProject(projectInfo);

				util.message("新建成功");
				openProject(projectInfo);
			} else if (saveType == "copy") {
				myProjects.unshift(projectInfo);
				project.addProject(projectInfo);

				util.message("复制成功");
				openProject(projectInfo);
			} else if (saveType == "save") {
				if (newSave) {
					myProjects.unshift(projectInfo);
					project.updateProject(projectInfo, true);
					currentProject = projectInfo;
					tempProject = null;
				} else {
					var index = findProjectIndex(myProjects, projectInfo.id);
					myProjects[index] = projectInfo;
				}
				util.message("保存成功");
			} else {
				var index = findProjectIndex(myProjects, projectInfo.id);
				myProjects[index] = projectInfo;

				project.updateProject(projectInfo);
				util.message("更新成功");
			}
		});
	}

	function onProjectDeleteSuccess(id) {
		var index = findProjectIndex(myProjects, id);
		index >= 0 && myProjects.splice(index, 1);
		project.removeProject(id);

		var info = getCurrentProject();
		if (info.id != id) {
			return;
		}

		currentProject = null;
		myProjects.length ? openProject(myProjects[0]) : openProject(getDefaultProject());
	}

	function onProjectUpload() {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		if (projectInfo.id == 0) {
			emitor.trigger('project', 'show', {
				data: projectInfo,
				type: 'save'
			});
			return;
		}

		projectInfo.project_data = JSON.stringify(getProjectData());
		projectInfo.user_id = userModel.getUserId();

		projectModel.save(projectInfo).done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				return;
			}

			projectModel.build(projectInfo.id).done(function(res) {
				if (res.status != 0) {
					util.message(res.message);
					return;
				}

				util.message("编译成功，正在上传请稍候");
				uploadModel.check(true).done(function() {
					uploadModel.upload(res.url).done(function() {
						util.message("上传成功");
					}).fail(function(code, args) {
						onProjectUploadFail(code, args).done(function(portPath) {
							uploadModel.upload(res.url, portPath).done(function() {
								util.message("上传成功");
							}).fail(onProjectUploadFail);
						});
					});
				});
			});
		});
	}

	function onProjectUploadFail(code, args) {
		var promise = $.Deferred();

		switch (code) {
			case 1:
				util.message("找不到串口");
				break;
			case 2:
				util.message("找不到Arduino");
				break;
			case 3:
				var ports = args;
				emitor.trigger("port", "show", {
					ports: ports,
					callback: function(portPath) {
						promise.resolve(portPath);
					}
				});
				break;
			case 4:
				util.message("连接失败");
				break;
			case 5:
				util.message("上传失败");
				break;
		}

		return promise;
	}

	function onCodeRefresh() {
		var hardwareBlockData = hardware.getBlockData();
		var codeInfo = software.getCode(hardwareBlockData);

		var projectInfo = getCurrentProject();
		codeInfo.name = projectInfo.project_name;
		codeInfo.author = userModel.getUserName();
		code.genCode(codeInfo);
	}

	function onSoftwareBlockUpdate() {
		var hardwareBlockData = hardware.getBlockData();
		software.updateBlocks(hardwareBlockData);
	}

	function getProjectData() {
		return {
			hardware: hardware.getData(),
			software: software.getData(),
			code: code.getData(),
		};
	}

	function getCurrentProject() {
		return currentProject;
	}

	function getDefaultProject() {
		var now = new Date();
		return {
			id: 0,
			project_name: "我的项目",
			project_intro: "项目简介",
			public_type: 2,
			project_data: {},
			created_at: now,
			updated_at: now,
		};
	}

	function findProjectIndex(projects, id) {
		var index = -1;
		projects && projects.forEach(function(projectInfo, i) {
			if (projectInfo.id == id) {
				index = i;
				return true;
			}
		});

		return index;
	}

	function convertProject(projectInfo) {
		if (typeof projectInfo.project_data == "string") {
			try {
				projectInfo.project_data = JSON.parse(projectInfo.project_data);
			} catch (ex) {
				projectInfo.project_data = {};
			}
		}

		if (typeof projectInfo.created_at == "string") {
			projectInfo.created_at = new Date(projectInfo.created_at);
		}

		if (typeof projectInfo.updated_at == "string") {
			projectInfo.updated_at = new Date(projectInfo.updated_at);
		}

		return projectInfo;
	}

	return {
		init: init,
	}
});
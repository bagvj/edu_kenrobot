define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/userModel', 'app/model/projectModel', 'app/component/content/project', 'app/component/content/hardware', 'app/component/content/software'], function(_, util, emitor, userModel, projectModel, project, hardware, software) {
	var openedProjects;
	var myProjects;

	function init() {
		openedProjects = [];
		myProjects = [];

		emitor.on('app', 'start', onAppStart);
		emitor.on('project', 'save', onProjectSave);
		emitor.on('project', 'edit', onProjectEdit);
		emitor.on('project', 'delete', onProjectDelete);
	}

	function openProject(projectInfo) {

	}

	function onAppStart() {
		userModel.authCheck().done(loadMyProject);
	}

	function onProjectSave(projectInfo, saveType) {
		projectInfo = projectInfo || {};
		if (saveType == "edit") {
			//编辑

		} else if (saveType == "save") {
			//保存
			var info = getCurrentProject();
			projectInfo.id = info.id;
			projectInfo.project_data = JSON.stringify(getProjectData());
		} else {
			//新建
		}
		projectInfo.user_id = userModel.getUserId();

		projectModel.save(projectInfo).done(function(result) {
			result.status == 0 ? onProjectSaveSuccess(result.data.project_id, saveType) : util.message(result.message);
		});
	}

	function onProjectEdit(id) {
		var index = findProjectIndex(myProjects, id);
		var projectInfo = myProjects[index];
		emitor.trigger('project', 'show', {
			data: projectInfo,
			type: 'edit'
		});
	}

	function onProjectDelete(id) {
		var index = findProjectIndex(myProjects, id);
		var projectInfo = myProjects[index];
		// emitor.trigger('project', 'show', projectInfo, 'edit');
	}

	function loadMyProject() {
		projectModel.getAll().done(function(result) {
			if(result.status != 0) {
				util.message(result.message);
				return;
			}

			result.data.forEach(function(projectInfo) {
				projectInfo = convertProject(projectInfo);
				myProjects.push(projectInfo);
			});
			project.updateList(myProjects);
		});
	}

	function onProjectSaveSuccess(projectId, saveType) {
		projectModel.get(projectId).done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				return;
			}

			if (saveType == "new") {
				hardware.reset();
				software.reset();

				var projectInfo = convertProject(result.data);
				myProjects.push(projectInfo);
				project.addProject(projectInfo);

				util.message("新建成功");
			} else if (saveType == "save") {
				util.message("保存成功");
			} else {
				var projectInfo = convertProject(result.data);
				var index = findProjectIndex(myProjects, projectInfo.id);
				myProjects[index] = projectInfo;

				project.updateProject(projectInfo);
				util.message("更新成功");
			}
		});
	}

	function getProjectData() {
		return {
			hardware: hardware.getData(),
			software: software.getData(),
		};
	}

	function getCurrentProject() {

	}

	function findProjectIndex(projects, id) {
		var index;
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
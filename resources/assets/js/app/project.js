define(['./EventManager', './config', './util', './projectApi', './user', './ext/agent'], function(EventManager, config, util, projectApi, user, agent) {
	var isLoading;
	var myProjects = [];
	var createNew;

	function init() {
		EventManager.bind('user', 'login', onLogin);

		var scope = angular.element('.ng-app').scope();
		scope.$on('onRouteChange', onRouteChange);
	}

	function create() {
		getApi().setProject();
	}

	function upload() {
		user.authCheck().then(doBuild, user.showLoginDialog);
	}

	function save() {
		if(config.pc) {
			doSave();
		} else {
			user.authCheck().then(doSave, user.showLoginDialog);
		}
	}

	function onLogin() {
		loadMyProject();
	}

	function loadMyProject() {
		var promise = $.Deferred();
		user.authCheck().done(function() {
			projectApi.getAll().done(function(result) {
				addProject(result.data);
				promise.resolve();
			});
		}).fail(function() {
			promise.resolve();
		});

		return promise;
	}

	function addProject(projects) {
		projects.forEach(function(info) {
			myProjects.push(convertProject(info));
		});
	}

	function convertProject(info) {
		if(typeof info.project_data == "string") {
			try {
				info.project_data = JSON.parse(info.project_data);
			} catch(ex) {
				info.project_data = {};
			}
		}

		if(typeof info.created_at == "string") {
			info.created_at = new Date(info.created_at);
		}

		if(typeof info.updated_at == "string") {
			info.updated_at = new Date(info.updated_at);
		}

		return info;
	}

	function getCurrentProject() {
		return projectInfo;
	}

	function openProject(info) {
		projectInfo = info || getDefaultProject();
		getApi().setProject(projectInfo.project_data);
		isLoading = false;
	}

	function doBuild() {
		var info = getCurrentProject();
		var id = info.id;
		if(id == 0) {
			util.message("请先保存");
			return;
		}

		var state = {};
		state.isBuilding = true;

		var dialog = util.dialog({
			selector: ".building-dialog",
			onClosing: function() {
				return !state.isBuilding;
			}
		});
		var content = $('.x-dialog-content', dialog).text('正在保存...');

		$('.confirm-btn', dialog).off('click').on('click', function() {
			if(!state.resume) {
				$('.x-dialog-close', dialog).click();
				return;
			}

			state.resume = false;
			var portPath = $('.portList', dialog).val();
			content.text("正在烧写...");
			agent.resumeUpload(state.url, portPath, function(status) {
				var message;
				switch(status) {
					case 0:
						message = "烧写成功";
						state.isBuilding = false;
						break;
					case 3:
						message = "连接失败";
						state.isBuilding = false;
						break;
					case 4:
					default:
						message = "烧写失败";
						state.isBuilding = false;
						break;
				}
				content.html(message);
			});
		});

		doProjectSave(id, false, function(status) {
			if(status != 0) {
				content.text("保存失败");
				state.isBuilding = false;
				return;
			}

			content.text("保存成功，正在编译...");

			projectApi.build(id).done(function(result) {
				if(result.status != 0) {
					content.text("编译失败");
					state.isBuilding = false;
					return;
				}

				content.text("编译成功，正在烧写...");
				doUpload(result.url, content, state);
			});
		});
	}

	function doUpload(url, content, state) {
		agent.upload(url, function(status, ports) {
			var message;
			switch(status) {
				case 0:
					message = "烧写成功";
					state.isBuilding = false;
					break;
				case 1:
					message ="找不到串口";
					state.isBuilding = false;
					break;
				case 2:
					message = "请选择串口：";
					var portList = $('<select class="portList">');
					for(var i = 0; i < ports.length; i++) {
						var port = ports[i];
						$('<option>').text(port.path).attr("title", port.displayName).appendTo(portList);
					}
					message += portList.prop("outerHTML");
					state.resume = true;
					state.url = url;
					break;
				case 3:
					message = "连接失败";
					state.isBuilding = false;
					break;
				case 4:
				default:
					message = "烧写失败";
					state.isBuilding = false;
					break;
			}
			content.html(message);
		});
	}

	function doSave() {
		var info = getCurrentProject();
		var id = info.id;
		if(id == 0) {
			showSaveDialog();
		} else {
			doProjectSave(id);
		}
	}

	function showSaveDialog() { 
		var dialog = util.dialog('.save-dialog');
		var info = getCurrentProject();

		var form = $('form', dialog);
		$('input[name="name"]', form).val(info.project_name);
		$('textarea[name="intro"]', form).val(info.project_intro);
		$('input[name="public-type"][value="' + info.public_type + '"]', form).attr("checked", true);
		$('.save-btn', form).off('click').on('click', function() {
			doProjectSave(0);
		});
	}

	function doProjectSave(id, showMessage, callback) {
		showMessage = showMessage != false;
		var project;
		if(id == 0) {
			var dialog = $('.save-dialog');
			var form = $('form', dialog);
			var project_name = $('input[name="name"]', form).val();

			project = {
				id: id,
				project_name: project_name,
				user_id: user.getUserId(),
				project_intro: $('textarea[name="intro"]', form).val(),
				project_data: JSON.stringify(getProjectData()),
				public_type: $("input[name='public-type']:checked", form).val(),
			};
			$('.x-dialog-close', dialog).click();
		} else {
			project = {
				id: id,
				user_id: user.getUserId(),
				project_data: JSON.stringify(getProjectData()),
			}
		}

		if(project.project_data.length > config.project.maxCodeLength) {
			util.showMessage('代码太长');
			return;
		}

		projectApi.save(project).done(function(result) {
			if(result.status == 0) {
				if(id == 0) {
					var info = getCurrentProject();
					info.id = result.data.project_id;
					info.project_name = project.project_name;
					info.project_intro = project.project_intro;
					info.public_type = project.public_type;
				}
			}
			showMessage && util.message(result.message);
			callback && callback(result.status);
		});
	}

	function onRouteChange(e, routeParams) {
		if(isLoading) {
			return;
		}

		isLoading = true;
		var hash = routeParams.hash;
		var action = routeParams.action;

		var doLoad = function() {
			if(action == "create") {
				createNew = true;
				getApi().reload();
				return;
			} else if(hash) {
				projectApi.get(hash, "hash").done(onLoadProject);
				return;
			}

			var info = createNew ? getDefaultProject() : getLastProject();
			openProject(info);
		}

		setTimeout(doLoad, 100);
	}

	function onLoadProject(result) {
		if(result.status != 0) {
			util.message(result.message);
			openProject();
			return;
		}

		openProject(convertProject(result.data));
	}

	function getLastProject() {
		var index = -1;
		var time = 0;
		myProjects.forEach(function(info, i) {
			if(info.updated_at > time) {
				time = info.updated_at;
				index = i;
			}
		});

		return index >= 0 ? myProjects[index] : getDefaultProject();
	}

	function getDefaultProject() {
		return {
			id: 0,
			user_id: user.getUserId(),
			project_name: "我的项目",
			project_intro: "我的项目简介",
			public_type: 2,
			project_data: {},
		};
	}

	function getProjectData() {
		return getApi().getProject();
	}

	function getApi() {
		return angular.element('#api-controller').scope().getApi();
	}

	return {
		init: init,
		create: create, 
		save: save,
		upload: upload,
		loadMyProject: loadMyProject,
	}
});
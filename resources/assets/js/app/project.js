define(['./EventManager', './util', './user', './ext/agent'], function(EventManager, util, user, agent) {
	var api;
	var projectInfo;
	var isLoading;

	function init() {
		projectInfo = getDefaultProject();

		var scope = angular.element('.ng-app').scope();
		scope.$on('onRouteChange', onRouteChange);
	}

	function create() {
		reset();
	}

	function upload() {
		user.authCheck(function(success) {
			success ? doBuild() : user.showLoginDialog();
		});
	}

	function save() {
		user.authCheck(function(success) {
			success ? doSave() : user.showLoginDialog();
		});
	}

	function edit() {
		user.authCheck(function(success) {
			success ? showSaveDialog() : user.showLoginDialog();
		});
	}

	function reset() {
		ensureApi();
		api.resetProject();
		load(getDefaultProject());
	}

	function load(p) {
		if(typeof p.project_data == "string") {
			try {
				p.project_data = JSON.parse(p.project_data);
			} catch(ex) {
				p.project_data = {};
			};
		}
		projectInfo = p;
		ensureApi();
		api.setProject(projectInfo.project_data);
	}

	function doBuild() {
		var id = projectInfo.id;
		if(id == 0) {
			util.message("请先保存");
			return;
		}

		doProjectSave(id, false, function(status) {
			if(status != 0) {
				util.message("保存失败");
				return;
			}

			$.ajax({
				type: "POST",
				url: "/api/project/build",
				dataType: "json",
				data: {
					id: id
				},
			}).done(function(result) {
				if(result.status != 0) {
					util.message("编译失败");
					return;
				}

				doUpload(result.url);
			});
		});
	}

	function doUpload(url) {
		agent.upload(url, function(status) {
			switch(status) {
				case 0:
					util.message("烧写成功");
					break;
				case 1:
					util.message("找不到串口");
					break;
				case 2:
					util.message("找不到arduino");
					break;
				case 3:
					util.message("连接arduino失败");
					break;
				case 4:
				default:
					util.message("烧写失败");
					break;
			}
		});
	}

	function doSave() {
		var id = projectInfo.id;
		if(id == 0) {
			showSaveDialog();
		} else {
			doProjectSave(id);
		}
	}

	function showSaveDialog() { 
		var dialog = util.dialog('.save-dialog');

		var form = $('form', dialog);
		$('input[name="name"]', form).val(projectInfo.project_name);
		$('textarea[name="intro"]', form).val(projectInfo.project_intro);
		$('input[name="public-type"][value="' + projectInfo.public_type + '"]', form).attr("checked", true);
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

		$.ajax({
			type: 'POST',
			url: '/api/project/save',
			data: project,
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0) {
				if(id == 0) {
					projectInfo.id = result.data.project_id;
					projectInfo.project_name = project.project_name;
					projectInfo.project_intro = project.project_intro;
					projectInfo.public_type = project.public_type;
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
		var hash = routeParams.hash || "";
		hash = /^[0-9a-zA-Z]{6}$/.test(hash) ? hash : "";

		user.authCheck(function(success) {
			if(!success && !hash) {
				reset();
				isLoading = false;
				return;
			}

			var data = {};
			data.user_id = user.getUserId();
			if(hash) {
				data.key = hash;
			} else {
				data.type = 'last';
			}

			$.ajax({
				type: 'POST',
				url: '/api/project/get',
				dataType: 'json',
				data: data,
			}).done(onLoadProject);
		});
	}

	function onLoadProject(result) {
		isLoading = false;
		if(result.status != 0) {
			util.message(result.message);
			ensureApi();
			api.reload();
			return;
		}

		load(result.data);
	}

	function getDefaultProject() {
		return {
			id: 0,
			user_id: user.getUserId(),
			project_name: "我的项目",
			project_intro: "我的项目简介",
			public_type: 1,
			project_data: {},
		};
	}

	function getProjectData() {
		ensureApi();
		return api.getProject();
	}

	function ensureApi() {
		if(!api) {
			api = angular.element('#api-controller').scope().getApi();
		}
	}

	return {
		init: init,
		create: create, 
		save: save,
		edit: edit,
		upload: upload,
	}
});
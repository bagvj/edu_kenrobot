define(['./EventManager', './util', './user', './logcat'], function(EventManager, util, user, logcat) {
	//项目模版
	var projectTemplate = '<li data-project-id="{{id}}" data-view="software"><div class="title"><i class="kenrobot ken-icon-folder icon"></i><span class="name">{{project_name}}</span><i class="kenrobot arrow"></i></div><div class="view"><div><i class="kenrobot ken-icon-code icon"></i><span class="name">{{project_name}}</span>.ino</div></div></li>';
	var tabTemplate = '<li data-project-id="{{id}}"><span class="name">{{project_name}}</span><i class="kenrobot ken-close close-btn"></i></li>';

	//项目
	var projects = [];
	//状态
	var state;

	var api;

	function init() {
		var bar = $('.project-sidebar');
		var icon = $('.project-icon', bar);
		var list = $('.project-list', bar);

		var hideList = function() {
			icon.removeClass("active");
			list.hide();
		}

		list.on('mouseleave', hideList);
		bar.on('mouseleave', hideList);

		icon.on('mouseover', function() {
			icon.addClass("active");
			list.show();
		});

		projects = [getDefaultProject()];
		bindProjectEvent();
	}

	function isBuild(callback) {
		var api = getApi();
		var checkChanged = function(changed, projectInfo) {
			// if(changed) {
			// 	// util.message("请先保存");
			// 	util.message("请先编译");
			// 	return;
			// }

			var info = projectInfo.info;
			if(!info || !info.url) {
				util.message("请先编译");
				return;
			}

			callback(info.url);
		};

		api.hasChanged(checkChanged);
	}

	function build() {
		var api = getApi();
		var callback = function(changed, projectInfo) {
			var isBuilding = true;
			var dialog = util.dialog({
				selector: '.building-dialog',
				content: "正在编译，请稍候...",
				onClosing: function() {
					return !isBuilding;
				}
			});

			var doBuild = function() {
				var info = projectInfo.info || {};
				$.ajax({
					type: "POST",
					url: "/project/build",
					dataType: "json",
					data: {
						type: 'source',
						board_type: 'uno',
						source: projectInfo.code,
						project_name: '我的项目',
						hash: info.hash,
					},
				}).done(function(result) {
					isBuilding = false;
					if(result.status == 0) {
						info.url = result.url
						info.hash = result.hash;
						api.setProjectInfo(info);
					} else {
						delete info.url;
						info.hash = result.hash;
						api.setProjectInfo(info);

						logcat.show();
						logcat.clear();
						logcat.append(result.output.join("\n"));
					}

					$('.x-dialog-content', dialog).text(result.message);
				});
			};

			doBuild();
		};

		api.hasChanged(callback);
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		util.toggleActive(li, null, true);
	}

	function onProjectFileClick(e) {
		var li = $(this).parent().parent();
		var id = li.data('project-id');
		var projectInfo = getProjectInfo(id);
		var ul = $('.top-tabs > ul');

		var targetTab = ul.find('> li[data-project-id="' + id + '"]');
		if(targetTab.length == 0) {
			targetTab = $(tabTemplate.replace(/\{\{project_name\}\}/g, projectInfo.project_name).replace(/\{\{id\}\}/g, projectInfo.id));
			targetTab.appendTo(ul);
			bindTabEvent();
		}

		targetTab.click();
	}

	function onProjectActionClick(e) {
		var li = $(this);
		var action = li.data("action");
		switch(action) {
			case "new":
				onProjectNewClick();
				break;
			case "edit":
				onProjectEditClick();
				break;
			case "delete":
				onProjectDeleteClick();
				break;
		}
	}

	function onProjectNewClick(e) {

	}

	function onProjectEditClick(e) {

	}

	function onProjectDeleteClick(e) {

	}

	function bindProjectEvent() {
		var titles = $('.project-list .list .title').off('click').on('click', onProjectTitleClick);
		$('.project-list .list .view > div').off('click').on('click', onProjectFileClick);

		var li = titles.eq(titles.length - 1).click().parent();
		var files = $('.view > div', li);
		if(files.filter('.active').length == 0) {
			files.eq(0).click();
		}
	}

	function bindTabEvent() {
		$('.top-tabs > ul > li').off('click').on('click', onTabClick);
		$('.top-tabs > ul > li .close-btn').off('click').on('click', onTabCloseClick);
	}

	function onTabClick(e) {
		var li = $(this);
		var view = li.data('view');
		var active = li.hasClass("active");

		if(!active) {
			var currentLi = li.parent().find("li.active");
			if(currentLi.length > 0) {
				var currentId = currentLi.data("project-id");
				doSaveView(currentId);
				currentLi.removeClass("active");
			}

			li.addClass("active");
		}
		// var projectInfo = getCurrentProject();
		// var project_data = projectInfo.project_data;

		// board.setData(project_data.board);
		// hardware.setData(project_data.hardware);
		// software.setData(project_data.software);

		// doSwitchView(view);
	}

	function doSwitchView(view) {
		var projectInfo = getCurrentProject();
		var id = projectInfo.id;
		var project_data = projectInfo.project_data

		view = view || "software";
		if(view == "hardware") {
			project_data.software = software.getData();
			hardware.setData(project_data.hardware);
		} else {
			software.gen();
			project_data.hardware = hardware.getData();
		}

		$('.top-tabs > ul > li[data-project-id="' + id + '"]').data("view", view);

		EventManager.trigger("sidebar", "viewChange", view);
	}

	function doSaveView(id) {
		// var projectInfo = getProjectInfo(id);
		// software.gen();
		// projectInfo.project_data = getProjectData();
	}

	function onTabCloseClick(e) {
		var li = $(this).parent();
		var id = li.data('project-id');
		var active = li.hasClass("active");
		
		var index = li.index() - 1;
		index = index < 0 ? 0 : index;

		li.remove();
		doSaveView(id);

		if(active) {
			var list = $('.top-tabs > ul > li');
			if(list.length == 0) {
				$('.main-tabs > .tab.active').removeClass("active");
			} else {
				setTimeout(function() {
					list.eq(index).click();
				}, 10);
			}
		}
		
		return false;
	}

	function getProjectData() {
		// return {
		// 	board: board.getData(),
		// 	hardware: hardware.getData(),
		// 	software: software.getData(),
		// };
		return {};
	}

	function getProjectHtml(projectInfo) {
		return projectTemplate.replace(/\{\{project_name\}\}/g, projectInfo.project_name)
							  .replace(/\{\{id\}\}/g, projectInfo.id);
	}

	function getDefaultProject() {
		return {
			id: 0,
			user_id: user.getUserId(),
			project_name: "我的项目",
			project_intro: "我的项目简介",
			public_type: 1,
			project_data: {},
			status: 0,
		};
	}

	function getCurrentProject() {
		var id = $('.top-tabs > ul > li.active').data('project-id');
		return getProjectInfo(id);
	}

	function getProjectInfo(id) {
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				return info;
			}
		}
	}

	function getProjectIndex(id) {
		var index = -1;
		for(var i = 0; i < projects.length; i++){
			var info = projects[i];
			if(info.id == id) {
				index = i;
				break;
			}
		}
		return index;
	}

	function getApi() {
		if(!api) {
			api = angular.element($('#api-controller')).scope().getApi();
		}
		return api;
	}

	return {
		init: init,
		isBuild: isBuild,
		build: build,
	}
});
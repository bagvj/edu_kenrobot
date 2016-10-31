define(['vendor/jquery', 'vendor/director', 'app/config/config', 'app/util/util', 'app/util/emitor'], function($1, $2, config, util, emitor) {
	var mainWrap;
	var router;

	function init() {
		printJoinUs();
		configAjax();
		configRoute();

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		emitor.on('upload', 'check-fail', onUploadCheckFail);
		emitor.on('route', 'set', onSetRoute);
		emitor.on('route', 'init', onInitRoute);
	}

	function onAppStart() {

	}

	function onContextMenu(e) {
		e.preventDefault();

		hideContextMenu();
		hideSelectMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function onWindowResize(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function onUploadCheckFail(code) {
		var isMobile = navigator.userAgent.match(/Android|iPhone|iPad/i) ? true : false;
		if (isMobile) {
			util.message("您的浏览器环境目前暂时不支持上传");
			return;
		}

		if (code == 1) {
			util.message("上传功能目前只支持chrome浏览器");
		} else {
			emitor.trigger("install", "show");
		}
	}

	function printJoinUs() {
		try {
			!config.debug && console.log(config.greet);
		} catch (e) {}
	}

	function configAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function configRoute() {
		router = Router({
			'/': onRouteDefault,
			'/project/new': onRouteNewProject,
			'/project/([0-9a-zA-Z]{6})/?': onRouteViewProject,
			'.*': onRouteOther, 
		});
	}

	function onInitRoute() {
		router.init("/");
	}

	function onRouteDefault() {
		emitor.trigger("project", "view");
	}

	function onRouteNewProject() {
		emitor.trigger("project", "new");
	}

	function onRouteViewProject(hash) {
		emitor.trigger("project", "view", hash);
	}

	function onRouteOther() {
		onSetRoute("/");
	}

	function onSetRoute(path) {
		router.setRoute(path);
	}

	function hideSelectMenu() {
		$('.x-select').removeClass("active");
	}

	function hideContextMenu() {
		$('.x-context-menu').removeClass("active");
	}

	return {
		init: init,
	};
});
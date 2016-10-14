define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var mainWrap;

	function init() {
		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		emitor.on('upload', 'check-fail', onUploadCheckFail);
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
		if(isMobile) {
			util.message("您的浏览器环境目前暂时不支持上传");
			return;
		}

		if(code == 1) {
			util.message("上传功能目前只支持chrome浏览器");
		} else {
			emitor.trigger("install", "show");
		}
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
define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {

	function init() {
		$(window).on('contextmenu', onContextMenu);
		$(window).on('click', onWindowClick);
		$(window).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
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
define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {

	function init() {
		$(window).on('contextmenu', onContextMenu);
		$(window).on('mousedown', onMouseDown);
		$(window).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {

	}

	function onContextMenu(e) {
		e.preventDefault();
		
		hideContextMenu();
		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onMouseDown(e) {
		hideContextMenu();
	}

	function onWindowResize(e) {
		emitor.delayTrigger('app', 'resize');
	}

	function hideContextMenu() {
		$('.x-context-menu').hide();
	}

	return {
		init: init,
	};
});
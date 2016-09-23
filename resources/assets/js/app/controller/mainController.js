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
		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideContextMenu();
		emitor.trigger("app", "click", e);
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
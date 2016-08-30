define(['vendor/jquery', 'app/util/util', 'app/util/emitor', './hardware/hardware', './software/software', './code/code'], function(_, util, emitor, hardware, software, code) {
	var region;

	function init() {
		region = $('.content-tabs');

		hardware.init();
		software.init();
		code.init();

		emitor.on('app', 'start', onAppStart);
		emitor.on('sidebar', 'activeTab', onActiveTab);
	}

	function onAppStart() {

	}

	function onActiveTab(name) {
		var tab = $('.tab-' + name, region);
		util.toggleActive(tab);
	}

	return {
		init: init,
	};
});
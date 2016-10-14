define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.install-dialog');

		emitor.on('install', 'show', onShow);
	}

	function onShow(args) {
		util.dialog({
			selector: dialogWin
		});
	}

	return {
		init: init,
	};
});
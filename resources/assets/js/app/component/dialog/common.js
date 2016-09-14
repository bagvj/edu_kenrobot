define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.common-dialog');

		emitor.on('common', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};
		var cls = args.type || "info";
		args.cls = cls;
		args.selector = dialogWin;

		util.dialog(args);
	}

	return {
		init: init,
	};
});
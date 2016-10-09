define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.common-dialog');

		emitor.on('common', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};
		args.selector = dialogWin;

		var type = args.type || "info";
		dialogWin.addClass(type);

		var onClosed = args.onClosed;
		args.onClosed = function() {
			$('.x-dialog-context', dialogWin).empty();
			dialogWin.removeClass(type);

			onClosed && onClosed();
		}

		util.dialog(args);
	}

	return {
		init: init,
	};
});
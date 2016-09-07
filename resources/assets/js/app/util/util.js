define(function() {
	function message(args) {
		var duration = 400;
		$("div.x-message").stop(true).fadeOut(duration / 2, function() {
			$(this).remove();
		});

		args = typeof args == "string" ? {
			text: args
		} : args;
		var type = args.type || "info";
		var text = args.text;
		var template = '<div class="x-message alert alert-' + type + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + text + '</div>';
		var messageDiv = $(template);
		messageDiv.appendTo($(".message-layer")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function() {
			$(this).remove();
		});
	}

	function dialog(args) {
		args = typeof args == "string" ? {
			selector: args
		} : args;
		var selector = args.selector;
		var dialogWin = $(selector);
		if (!dialogWin || !dialogWin.hasClass("x-dialog")) {
			return false;
		}

		dialogWin.clearQueue("fadeIn");
		dialogWin.clearQueue("fadeOut");

		var onConfirm = args.onConfirm;
		var onCancel = args.onCancel;
		var onClosing = args.onClosing;
		var onClose = args.onClose;
		var onClosed = args.onClosed;
		var onShow = args.onShow;

		var content = args.content;
		if (content) {
			$('.x-dialog-content', dialogWin).text(content);
		}

		var dialogLayer = $('.dialog-layer').addClass("active");
		var doClose = function(callback) {
			dialogWin.removeClass("dialog-in").addClass("dialog-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				dialogWin.hide().removeClass("dialog-fadeOut");
				dialogLayer.removeClass("active");
				onClose && onClose();
				callback && callback();
				onClosed && onClosed();
			});
			dialogWin.dequeue("fadeOut");
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing() != false) {
				doClose(onConfirm);
			}
		});

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing() != false) {
				doClose(onCancel);
			}
		});

		onShow && onShow();
		dialogWin.show().addClass("dialog-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("dialog-in").removeClass("dialog-fadeIn");
		});
		dialogWin.dequeue("fadeIn");

		return dialogWin;
	}

	function isInDialog() {
		return $('.dialog-layer').hasClass("active");
	}

	function toggleActive(target, collapseMode, cls) {
		cls = cls || "active";
		if (collapseMode) {
			if (target.hasClass(cls)) {
				target.removeClass(cls);
				return false;
			} else {
				target.siblings("." + cls).removeClass(cls);
				target.addClass(cls);
				return true;
			}
		} else {
			if (target.hasClass(cls)) {
				return false;
			}

			target.siblings("." + cls).removeClass(cls);
			target.addClass(cls);

			return true;
		}
	}

	function showMessage(selector, message, duration) {
		duration = duration || 2000;
		selector = $(selector).empty();
		var messageDiv = $('<div>').text(message).appendTo(selector);
		messageDiv.delay(duration).fadeOut(400, function() {
			messageDiv.remove();
		});
	}

	function aspectReset(aspect) {
		var origin = aspect._advisor.orig;
		aspect._advisor.remove();
		return origin;
	}

	function parseJson(data) {
		try {
			return JSON.parse(data);
		} catch (ex) {

		}
	}

	function numberToChinese(input) {
		var SYMBOLS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
		var UNIT_MAP = {
			'0': '',
			'1': '十',
			'2': '百',
			'3': '千',
			'4': '零万',
			'5': '十',
			'6': '百',
			'7': '千',
			'8': '零亿',
			'9': '十'
		};
		var Y_MAP = [0, 4, 8];

		if (input <= 0 || !parseInt(input, 10)) {
			return '请输入正整数';
		}

		var inputStr = '' + input;
		var inputArr = inputStr.split('').reverse();
		var inputLength = inputArr.length;

		if (inputLength > 10) {
			return '请输入10位以内的正整数';
		}

		var result = '';

		for (var i = 0; i < inputLength; i++) {
			var value = inputArr[i];
			var isY = Y_MAP.indexOf(i) !== -1;

			if (isY || (!isY && value != 0)) {
				result += UNIT_MAP[i];
			}

			result += SYMBOLS[value];
		}

		result = result.split('').reverse().join('');

		result = result.replace(/零+$/, '')
			.replace(/零+/, '零')
			.replace(/零+万/, '万')
			.replace(/零+亿/, '亿')
			.replace(/亿万/, '亿')
			.replace(/^一十/, '十');

		return result;
	}

	return {
		message: message,
		showMessage: showMessage,
		dialog: dialog,
		isInDialog: isInDialog,
		toggleActive: toggleActive,
		aspectReset: aspectReset,
		parseJson: parseJson,
		numberToChinese: numberToChinese,
	}
});
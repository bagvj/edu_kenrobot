define(function(){
	
	function message(args) {
		var duration = 300;
		$("div.x-message").stop(true).fadeOut(duration / 2, function(){
			$(this).remove();
		});

		args = typeof args == "string" ? {text: args} : args;
		var type = args.type || "info";
		var text = args.text;
		var template = '<div class="x-message x-message-' + type + '"><i class="x-message-close kenrobot ken-close"></i>' + text + '</div>';
		var messageDiv = $(template);
		$('.x-message-close', messageDiv).on('click', function() {
			messageDiv.stop(true).fadeOut(duration / 2, function() {
				messageDiv.remove();
			});
		});
		messageDiv.appendTo($(".message-layer")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function(){
			messageDiv.remove();
		});
	}

	function dialog(args) {
		args = typeof args == "string" ? {selector: args}: args;
		var selector = args.selector;
		var dialogWin = $(selector);
		if(!dialogWin || !dialogWin.hasClass("x-dialog")) {
			return false;
		}

		var onConfirm = args.onConfirm;
		var onCancel = args.onCancel;
		var onClosing = args.onClosing;
		var onClose = args.onClose;
		var onShow = args.onShow;

		var content = args.content;
		if(content) {
			$('.x-dialog-content', dialogWin).text(content);
		}

		var dialogLayer = $('.dialog-layer').addClass("active");
		var doClose = function(callback) {
			dialogWin.removeClass("dialog-fadeIn").addClass("dialog-fadeOut").delay(300).queue(function() {
				dialogWin.hide().removeClass("dialog-fadeOut");
				dialogLayer.removeClass("active");
				onClose && onClose();
				callback && callback();
			});
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose(onConfirm);
			} 
		});	

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose(onCancel);
			} 
		});

		onShow && onShow();
		dialogWin.stop().show().removeClass('dialog-fadeOut').addClass("dialog-fadeIn");

		return dialogWin;
	}

	function isInDialog() {
		return $('.dialog-layer').hasClass("active");
	}

	function toggleActive(target, collapseMode) {
		if(collapseMode) {
			if(target.hasClass("active")) {
				target.removeClass("active");
				return false;
			} else {
				target.siblings(".active").removeClass("active");
				target.addClass("active");
				return true;
			}
		} else {
			if (target.hasClass("active")) {
				return false;
			}

			target.siblings(".active").removeClass("active");
			target.addClass("active");

			return true;
		}
	}

	function dispatchEvent(type, detail) {
		var event = new CustomEvent(type, {detail: detail});
		window.dispatchEvent(event);
	}

	return {
		message: message,
		dialog: dialog,
		isInDialog: isInDialog,
		toggleActive: toggleActive,
		dispatchEvent: dispatchEvent,
	}
});
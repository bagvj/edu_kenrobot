define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/userModel'], function(_, util, emitor, userModel) {
	var dialogWin;

	var loginCheckTimer;
	var loginCallback;
	var scanTimerId;

	function init() {
		dialogWin = $('.login-dialog');
		
		$('.switch li', dialogWin).on('click', onSwitch);
		$('.qrcode', dialogWin).hover(onQrcodeOver, onQrcodeOut);
		$('.login-btn', dialogWin).on('click', onLoginClick);
		$('form', dialogWin).on('keyup', onEnter);

		emitor.on('login', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};
		loginCallback = args.callback;
		var type = args.type || "weixin";
		var isRegister = args.isRegister;

		$('.switch .' + type, dialogWin).click();
		if(isRegister) {
			$('.switch', dialogWin).removeClass("active");
			$('.login-tips', dialogWin).removeClass("active");
			$('.register-tips', dialogWin).addClass("active");
			$('.footer .login-footer', dialogWin).removeClass("active");
			$('.footer .register-footer', dialogWin).addClass("active");
		} else {
			$('.switch', dialogWin).addClass("active");
			$('.login-tips', dialogWin).addClass("active");
			$('.register-tips', dialogWin).removeClass("active");
			$('.footer .login-footer', dialogWin).addClass("active");
			$('.footer .register-footer', dialogWin).removeClass("active");
		}

		if(type == "account") {
			$('.email', dialogWin).focus();
		}

		util.dialog({
			selector: dialogWin,
			onClosing: onClosing,
		});
	}

	function onClosing() {
		loginCallback = null;
		setWeixinLoginCheck(false);
	}

	function onSwitch(e) {
		var li = $(this);
		var action = li.data("action");
		var tab = $('.tab-' + action, dialogWin);

		util.toggleActive(tab);
		util.toggleActive(li);

		if(action == "weixin") {
			setWeixinLoginCheck(true);
		} else {
			$('.email', dialogWin).focus();
			setWeixinLoginCheck(false);
		}
	}

	function onQrcodeOver(e) {
		if(dialogWin.is(':animated')) {
			return;
		}

		clearTimeout(scanTimerId);
		$('.scan', dialogWin).stop().show().removeClass("x-fadeOut").addClass("x-fadeIn");
	}

	function onQrcodeOut(e) {
		if(dialogWin.is(':animated')) {
			return;
		}

		var scan = $('.scan', dialogWin).removeClass("x-fadeIn").addClass("x-fadeOut");
		scanTimerId = setTimeout(function() {
			scan.hide().removeClass("x-fadeOut");
		}, 300);
	}

	function onLoginClick() {
		var username = $('.email', dialogWin).val();
		var password = $('.password', dialogWin).val();
		userModel.login(username, password).done(onAccountLogin);
	}

	function onEnter(e) {
		if(e.keyCode != 13) {
			return;
		}

		if(!$(".tab-account", dialogWin).hasClass("active")) {
			return;
		}

		$(".login-btn", dialogWin).click();
	}

	function setWeixinLoginCheck(value) {
		clearInterval(loginCheckTimer);
		if (!value) {
			return;
		}

		var key = $('.qrcode-key', dialogWin).val();
		var doCheck = function() {
			userModel.weixinLogin(key).done(onWeixinLogin)
		};

		loginCheckTimer = setInterval(doCheck, 3000);
	}

	function onAccountLogin(result) {
		if (result.status == 0) {
			//登录成功
			util.message(result.message);
			$('.x-dialog-close', dialogWin).click();

			doUpdateUser();
			doLoginCallback();
			emitor.trigger("user", "login");
		} else if (result.status == 1) {
			doUpdateUser();
			doLoginCallback();
		} else {
			var message = $('.message', dialogWin);
			message.addClass("active").text(result.message).delay(2000).queue(function() {
				message.removeClass("active").text('').dequeue();
			});
		}
	}

	function onWeixinLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			$('.x-dialog-close', dialogWin).click();
			util.message(result.message);

			doUpdateUser();
			doLoginCallback();
			emitor.trigger("user", "login");
		} else if (result.status == 1) {
			//已经登录
			setWeixinLoginCheck(false);
			doUpdateUser();
		} else {
			//登录失败

		}
	}

	function doLoginCallback() {
		loginCallback && loginCallback();
	}

	function doUpdateUser() {
		emitor.trigger('user', 'update');
	}

	return {
		init: init,
	};
});
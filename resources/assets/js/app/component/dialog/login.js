define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/userModel'], function($1, util, emitor, userModel) {
	var dialogWin;
	var loginTabs;
	var switchs;

	var qrcode;
	var qrcodeKey;
	var qrcodeTimeout = 5 * 60 * 1000;
	var qrcodeTimeoutTimer;

	var loginCheckTimer;
	var loginCallback;
	var scanTimerId;
	var dialogMode;
	var loginType;

	function init() {
		dialogWin = $('.login-dialog');

		//登录、注册切换
		$('.tab-login .switch-register, .tab-register .switch-login').on('click', onSwitchDialogMode);

		//登录切换
		switchs = $('.tab-login .switch li', dialogWin).on('click', onSwitchLoginType);
		loginTabs = $('.tab-login .tabs', dialogWin);

		//登录
		$('.tab-account .login', dialogWin).on('click', onLoginClick);

		//回车
		$('.tab-account .username, .tab-account .password', dialogWin).on('keyup', onLoginEnter);

		qrcode = $('.tab-quick .qrcode', dialogWin);
		qrcodeKey = $('.tab-quick .qrcode-key', dialogWin);

		//二维码过期，刷新
		$('.tab-quick .refresh', dialogWin).on('click', onRefreshQrcodeClick);

		//注册
		$('.tab-register .register', dialogWin).on('click', onRegisterClick);

		refreshWeixinQrcode();

		emitor.on('login', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};

		loginCallback = args.callback;

		switchDialogMode(args.mode || "login");
		switchLoginType(args.type || "quick");

		refreshWeixinQrcode();
		setTimeout(onQrcodeTimeout, qrcodeTimeout);

		util.showDialog({
			selector: dialogWin,
			afterClose: onAfterClose,
		});
	}

	function onAfterClose() {
		loginCallback = null;
		clearTimeout(onQrcodeTimeout);
		qrcodeTimeoutTimer = null;

		setWeixinLoginCheck(false);
	}

	function switchDialogMode(mode) {
		dialogMode = mode;

		$('.title .mode', dialogWin).text(dialogMode == "login" ? "登录" : "注册");

		var tab = $('.tab-' + dialogMode, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var titleHeight = $('.title', dialogWin).height();
		var height = tab.height();
		tab.parent().height(height);
		dialogWin.height(height + titleHeight);

		setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
		$('.reset-field', dialogWin).val('');
	}

	function switchLoginType(type) {
		loginType = type;

		switchs.filter('[data-action="' + loginType + '"]').addClass("active").siblings().removeClass("active");

		var tab = $('.tab-login .tab-' + loginType, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var index = tab.index();
		var x = index == 0 ? "0" : (0 - index * tab.width()) + "px";
		loginTabs.css("transform", "translateX(" + x + ")");

		if(loginType == "account") {
			$('.tab-login .username', dialogWin).focus();
		}

		setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
		$('.reset-field', dialogWin).val('');
	}

	function onSwitchDialogMode(e) {
		var mode = $(this).data("action");
		switchDialogMode(mode);
	}

	function onSwitchLoginType(e) {
		var li = $(this);
		if(li.hasClass("active")) {
			return;
		}
		
		var type = li.data("action");
		switchLoginType(type);
	}

	function onRefreshQrcodeClick(e) {
		refreshWeixinQrcode();
	}

	function onLoginClick() {
		var $username = $('.tab-account .username', dialogWin);
		var $password = $('.tab-account .password', dialogWin);
		var username = $.trim($username.val());
		var password = $.trim($password.val());

		if(username == "") {
			showError($username, "请输入帐号");
			return;
		}

		if(password == "") {
			showError($password, "请输入密码");
			return;
		}

		var remember = $('.tab-account .remember', dialogWin).is(":checked");
		userModel.login(username, password, remember).done(onAccountLogin);
	}

	function onLoginEnter(e) {
		e.keyCode == 13 && onLoginClick();
	}

	function setWeixinLoginCheck(value) {
		clearInterval(loginCheckTimer);
		loginCheckTimer = null;

		if (!value) {
			return;
		}

		loginCheckTimer = setInterval(function() {
			userModel.weixinLogin(qrcodeKey.val()).done(onWeixinLogin);
		}, 3000);
	}

	function onAccountLogin(result) {
		if (result.status == 0) {
			//登录成功
			closeDialog();
			emitor.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {

		} else {
			showError($(".tab-account .password"), result.message);
		}
	}

	function onWeixinLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			closeDialog();
			emitor.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {
			//已经登录
			setWeixinLoginCheck(false);
		} else if(result.status == -3) {
			refreshWeixinQrcode();
		} else {
			//登录失败
		}
	}

	function onQrcodeTimeout() {
		setWeixinLoginCheck(false);
		qrcode.addClass("timeout");
		qrcodeTimeoutTimer = null;
	}

	function closeDialog() {
		$('.dialog-close', dialogWin).click();
	}

	function onRegisterClick(e) {
		var $email = $('.tab-register .email', dialogWin);
		var $username = $('.tab-register .username', dialogWin);
		var $password = $('.tab-register .password', dialogWin);
		var $confirmPassword = $('.tab-register .confirm-password', dialogWin);

		var email = $.trim($email.val());
		var username = $.trim($username.val());
		var password = $.trim($password.val());
		var confirmPassword = $.trim($confirmPassword.val());

		if(email == "") {
			showError($email, "请输入邮箱");
			return;
		}

		if(username == "") {
			showError($username, "请输入帐号");
			return;
		}

		if(password == "") {
			showError($password, "请输入密码");
			return;
		}

		if(confirmPassword == "") {
			showError($confirmPassword, "请再次输入密码");
			return;
		}

		if(password != confirmPassword) {
			showError($confirmPassword, "请确认密码");
			return;
		}

		userModel.register({
			email: email,
			username: username,
			password: password,
		}).done(onRegisterSuccess);
	}

	function onRegisterSuccess(result) {
		if(result.status == 0) {
			closeDialog();
			emitor.trigger("user", "login");
		} else {
			showError($(".tab-register .username"), result.message);
		}
	}

	function showError(target, message) {
		var error = target.focus().siblings(".error");
		error.clearQueue().addClass("active").text(message).delay(2000).queue(function() {
			error.removeClass("active").text('').dequeue();
		});
	}

	function refreshWeixinQrcode() {
		userModel.weixinQrcode(true).done(function(result){
			if (result.status != 0) {
				return;
			}

			qrcodeKey.val(result.data.login_key);
			qrcode.attr('src', result.data.qrcodeurl);

			qrcode.removeClass("timeout");
			clearTimeout(onQrcodeTimeout);
			qrcodeTimeoutTimer = setTimeout(onQrcodeTimeout, qrcodeTimeout);
		});
	}

	function doLoginCallback() {
		loginCallback && loginCallback();
	}

	return {
		init: init,
	};
});
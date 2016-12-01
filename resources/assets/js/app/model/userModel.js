define(['vendor/jquery', 'vendor/jsencrypt', 'app/config/config', 'app/util/emitor'], function($1, JSEncrypt, config, emitor) {
	var userInfo;

	function getUserId() {
		return userInfo ? userInfo.uid : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.name : "";
	}

	function authCheck(showLogin) {
		var promise = $.Deferred();
		var type = userInfo && "check" || "all";
		$.ajax({
			type: 'POST',
			url: '/api/auth/check',
			data: {
				id: 0,
				type: type,
			},
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0) {
				type == "all" && (userInfo = result.user);
				promise.resolve();
			} else {
				userInfo = null;
				promise.reject();
				showLogin && emitor.trigger("login", "show");
			}
		});

		return promise;
	}

	function login(username, password, remember) {
		var promise = $.Deferred();

		var encrypt = new JSEncrypt.JSEncrypt();
		encrypt.setPublicKey(config.encrypt.publicKey);

		$.ajax({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: {
				username: username,
				password: encrypt.encrypt(password),
				remember: remember,
			},
		}).done(function(result) {
			if(result.status == 0 || result.status == 1) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinLogin(key) {
		var promise = $.Deferred();
		$.ajax({
			type: 'POST',
			url: '/api/auth/weixin/login',
			data: {
				login_key : key,
			},
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0 || result.status == 1) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinQrcode(refresh) {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/weixin/qrcode',
			data: {
				refresh: refresh || false,
			},
			dataType: 'json',
		});
	}

	return {
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		getUserName: getUserName,
		authCheck: authCheck,
		login: login,
		weixinLogin: weixinLogin,
		weixinQrcode: weixinQrcode,
	};
});
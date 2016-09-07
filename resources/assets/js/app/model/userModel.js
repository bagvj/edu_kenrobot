define(['vendor/jquery', 'app/util/emitor'], function(_, emitor) {
	var userInfo;

	function getUserId() {
		return userInfo ? userInfo.id : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.name : "";
	}

	function authCheck(showLogin) {
		var promise = $.Deferred();
		$.ajax({
			type: 'POST',
			url: '/api/auth/check',
			data: {
				id: 0
			},
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0) {
				userInfo = result.user;
				promise.resolve();
			} else {
				userInfo = null;
				promise.reject();
				showLogin && emitor.trigger("login", "show");
			}
		});

		return promise;
	}

	function login(username, password) {
		var promise = $.Deferred();
		$.ajax({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: {
				email: username,
				password: password
			},
		}).done(function(result) {
			if(result.status == 0) {
				userInfo = result.data;
			} else if(result.status == 1) {
				userInfo = result.data;
			} else {

			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinLogin(key) {
		var promise = $.Deferred();
		$.ajax({
			type: 'POST',
			url: '/api/auth/login/weixin',
			data: {
				key: key,
			},
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0) {
				userInfo = result.data;
			} else if(result.status == 1) {
				userInfo = result.data;
			} else {

			}
			promise.resolve(result);
		});

		return promise;
	}

	return {
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		getUserName: getUserName,
		authCheck: authCheck,
		login: login,
		weixinLogin: weixinLogin,
	};
});
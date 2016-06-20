define(['./config'], function(config) {
	var host = config.host || "";

	function authCheck() {
		return $.ajax({
			type: 'POST',
			url: host + '/api/auth/check',
			data: {
				id: 0
			},
			dataType: 'json',
		});
	}

	function login(username, password) {
		return $.ajax({
			type: 'POST',
			url: host + '/api/auth/login',
			dataType: 'json',
			data: {
				email: username,
				password: password
			},
		});
	}

	function weixinLogin(key) {
		return $.ajax({
			type: 'POST',
			url: host + '/api/auth/login/weixin',
			data: {
				key: key,
			},
			dataType: 'json',
		});
	}

	function loginInfo() {
		return $.ajax({
			type: 'POST',
			url: host + '/api/auth/info',
			data: {
				id: 0,
			},
			dataType: 'json',
		});
	}

	function logout() {
		return $.ajax({
			type: 'POST',
			url: host + '/api/auth/logout',
			data: {
				id: 0,
			},
			dataType: 'json',
		});
	}

	return {
		authCheck: authCheck,
		login: login,
		weixinLogin: weixinLogin,
		loginInfo: loginInfo,
		logout: logout,
	};
});
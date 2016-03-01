define(['jquery', 'util'], function($, util) {
	var userInfo;
	var loginCheckTimer;

	function init() {
		initLogin();
	}

	function getUserId() {
		return userInfo ? userInfo.id : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function authCheck(authedCallback, unAuthedCallback) {
		$.ajax({
			type: 'GET',
			url: '/auth/check',
			dataType: 'json',
		}).done(function(result){
			if (result.code == 0) {
				userInfo = result.user;
				authedCallback && authedCallback();
			} else {
				userInfo = null;
				unAuthedCallback && unAuthedCallback();
			}
		});
	}

	function showLoginDialog(callback) {
		var dialog = $('#login_dialog');
		dialog.css({
			top: -dialog.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing", function() {
			setLoginCheck(true, callback);
		});
		$('.dialog-layer').addClass("active");
	}

	function initLogin() {
		$('.qrLoginBtn, .baseLoginBtn').on('click', function(e) {
			var action = $(this).attr("data-action");
			if (action == "qrLogin") {
				$(".qrLoginBtn, .qrLogin").removeClass("active");
				$(".baseLoginBtn, .baseLogin").addClass("active");
				$(".qrLoginBtn").css({
					display: "none"
				});
				$(".baseLoginBtn").css({
					display: "block"
				});
				$('#use_weixin').removeClass("active");
			} else {
				$(".baseLoginBtn, .baseLogin").removeClass("active");
				$(".qrLoginBtn, .qrLogin").addClass("active");
				$(".baseLoginBtn").css({
					display: "none"
				});
				$(".qrLoginBtn").css({
					display: "block"
				});
			}
		});

		$('#login_dialog .close-btn').on('click', function(e) {
			$('#login_dialog').slideUp(100, function(event, ui) {
				$('#use_weixin').removeClass("active");
				$('.dialog-layer').removeClass("active");
			});
			setLoginCheck(false);
		});


		$('.submitBtn').on('click', function() {
			$.ajax({
				url: '/snspostlogin',
				data: {
					email: $('#email').val(),
					password: $('#password').val()
				},
			}).done(function(result){
				if (result.code == 0) {
					//登录成功
					util.message(result.message);
					$('#login_dialog .close-btn').fire('click');
				} else if (result.code == 1) {

				} else {
					$('.baseLogin .message span')
						.html(result.message)
						.delay(2000)
						.queue(function() {
							$(this).fadeOut().dequeue();
						});
				}
			});
		});

		$('.qrLogin .qrcode').hover(function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.is(':animated')) {
				use_weixin.addClass("active").show()
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					});
			}
		}, function(e) {
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.is(':animated')) {
				use_weixin.animate({
					left: left + 420,
					opacity: 0,
				}, null, null, function() {
					use_weixin.removeClass("active").hide();
				});
			}
		});
	}

	function setLoginCheck(value, callback) {
		clearInterval(loginCheckTimer);
		if (value) {
			loginCheckTimer = setInterval(function() {
				var key = $('#qrcode_key').val();
				$.ajax({
					url: '/weixinlogin?key=' + key,
				}).done(function(result) {
					if (result.code == 0) {
						//登录成功
						setLoginCheck(false);
						util.message(result.message);
						$('#login_dialog .close-btn').click();
						//回调
						callback && callback();
					} else if (result.code == 1) {
						//已经登录
						setLoginCheck(false);
					} else {
						//登录失败

					}
				});
			}, 3000);
		}
	}

	return {
		init: init,
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		authCheck: authCheck,
		showLoginDialog: showLoginDialog,
	};
});
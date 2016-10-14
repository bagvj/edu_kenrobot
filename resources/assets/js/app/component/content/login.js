define(['vendor/jquery', 'app/util/emitor', 'app/util/util', 'app/model/userModel'], function($1, emitor, util, userModel) {
	var region;

	function init() {
		region = $('.login-region');
		$('.login-menu ul > li', region).on('click', onMenuClick);
		
		emitor.on('user', 'update', onUserUpdate);
	}

	function onMenuClick(e) {
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "login":
				emitor.trigger('login', 'show');
				break;
			case "register":
				emitor.trigger('login', 'show', {
					isRegister: true,
				});
				break;
			case "share":
				emitor.trigger('share', 'show');
				break;
			case "setting":
				emitor.trigger('setting', 'show');
				break;
		}
	}

	function onUserUpdate() {
		var userInfo = userModel.getUserInfo();		
		var photo = $('.photo', region).removeClass("no-user");
		var href = photo.data('href');
		photo.attr('href', href);
		
		$('> img', photo).attr("src", userInfo.avatar_url);
		util.toggleActive($('.tab-user', region));
	}

	return {
		init: init,
	};
});
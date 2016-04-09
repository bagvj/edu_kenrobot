define(['./EventManager', './util', './user', './project', './logcat', './topMenu', './config', './ext/agent'], function(EventManager, util, user, project, logcat, topMenu, config, extAgent) {
	function init() {
		initPV();
		initAjax();
		initEscape();

		extAgent.init(config.extension);
		user.init();
		project.init();
		topMenu.init();
		logcat.init();
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	//pv统计
	function initPV() {
		if(config.needPV) {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/hm.js?6518098de0bee39bef219952dbbae669";
			var s = document.getElementsByTagName("script")[0]; 
			s.parentNode.insertBefore(hm, s);
		}
	}

	function initEscape() {
		$(window).on('keydown', function(e) {
			if(e.keyCode != 27) {
				return;
			}

			if(util.isInDialog()) {
				return;
			}

			if(logcat.isShow()) {
				logcat.hide();
				return;
			}
		});
	}

	return {
		init: init,
	}
});
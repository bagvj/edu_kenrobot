define(['./EventManager', './util', './user', './project', './topMenu', './config', './ext/agent'], function(EventManager, util, user, project, topMenu, config, agent) {
	function init() {
		initPV();
		initAjax();

		agent.init(config.extension);
		user.init();
		project.init();
		topMenu.init();
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

	return {
		init: init,
	}
});
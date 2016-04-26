define(['./EventManager', './util', './user', './project', './topMenu', './config', './ext/agent'], function(EventManager, util, user, project, topMenu, config, agent) {
	function init() {
		initAjax();

		angular.bootstrap('.ng-app', ['kenrobot']);

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

	return {
		init: init,
	}
});
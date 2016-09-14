define(['./common', './login', './project'], function(common, login, project) {

	function init() {
		common.init();
		login.init();
		project.init();
	}

	return {
		init: init,
	};
});
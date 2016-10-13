define(['./common', './login', './project', './port'], function(common, login, project, port) {

	function init() {
		common.init();
		login.init();
		project.init();
		port.init();
	}

	return {
		init: init,
	};
});
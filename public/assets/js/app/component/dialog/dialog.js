define(['./common', './login', './project', './port', './install', './share'], function(common, login, project, port, install, share) {

	function init() {
		common.init();
		login.init();
		project.init();
		port.init();
		install.init();
		share.init();
	}

	return {
		init: init,
	};
});
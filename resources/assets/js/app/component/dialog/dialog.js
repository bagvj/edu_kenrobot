define(['./common', './login', './project', './port', './install'], function(common, login, project, port, install) {

	function init() {
		common.init();
		login.init();
		project.init();
		port.init();
		install.init();
	}

	return {
		init: init,
	};
});
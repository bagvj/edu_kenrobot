define(['./login', './project'], function(login, project) {

	function init() {
		login.init();
		project.init();
	}

	return {
		init: init,
	};
});
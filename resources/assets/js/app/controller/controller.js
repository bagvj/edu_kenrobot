define(['./projectController'], function(projectController) {

	function init() {
		projectController.init();
	}

	return {
		init: init,
	};
});
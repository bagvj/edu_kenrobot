define(['./EventManager', './project'], function(EventManager, project) {
	function init() {
		$('.top-menu > ul > li,.sidebar > ul > li').on('click', onMenuClick);
	}

	function onMenuClick(e) {
		var li = $(this);
		var index = li.index();
		var action = li.data("action");
		switch(action) {
			case "new":
				onNewClick();
				break;
			case "save":
				onSaveClick();
				break;
			case "edit":
				onEditClick();
				break;
			case "upload":
				onUploadClick();
				break;
		}
	}

	function onNewClick() {
		project.create();
	}

	function onSaveClick() {
		project.save();
	}

	function onEditClick() {
		project.edit();
	}

	function onUploadClick() {
		project.upload();
	}

	return {
		init: init,
	}
});
define(['vendor/jquery', './userModel'], function(_, userModel) {

	function get(key, type) {
		type = type || "id";

		var data = {};
		data.user_id = userModel.getUserId();

		if (type == "hash") {
			data.hash = key;
		} else if (type == "last") {
			data.type = 'last';
		} else {
			data.id = key;
		}

		return $.ajax({
			type: 'POST',
			url: '/api/project/get',
			data: data,
			dataType: 'json',
		});
	}

	function getAll() {
		return $.ajax({
			type: 'POST',
			url: '/api/projects/user',
			data: {
				user_id: userModel.getUserId(),
			},
			dataType: 'json',
		});
	}

	function save(project) {
		return $.ajax({
			type: 'POST',
			url: '/api/project/save',
			data: project,
			dataType: 'json',
		});
	}

	function build(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/build",
			dataType: "json",
			data: {
				id: id,
				user_id: userModel.getUserId(),
			},
		});
	}

	function remove(id) {
		return $.ajax({
			type: "POST",
			url: "/api/project/delete",
			data: {
				id: id,
				user_id: userModel.getUserId(),
			},
			dataType: "json",
		});
	}

	function upload(data, onProgress) {
		return $.ajax({
			type: 'POST',
			url: '/api/project/upload',
			dataType: 'json',
			data: data,
			processData: false,
			contentType: false,
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();
				xhr.upload && onProgress && xhr.upload.addEventListener('progress', onProgress, false);
				return xhr;
			}
		});
	}

	return {
		get: get,
		getAll: getAll,
		save: save,
		build: build,
		remove: remove,
		upload: upload,
	};
});
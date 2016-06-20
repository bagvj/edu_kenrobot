define(['./config', './user'], function(config, user) {
	var host = config.host || "";

	function get(key, type) {
		type = type || "id";

		var data = {};
		data.user_id = user.getUserId();

		if(type == "hash") {
			data.hash = key;
		} else if(type == "last") {
			data.type = 'last';
		} else {
			data.id = key;
		}

		return $.ajax({
			type: 'POST',
			url: host + '/api/project/get',
			data: data,
			dataType: 'json',
		});
	}

	function getAll() {
		return $.ajax({
			type: 'POST',
			url: host + '/api/projects/user',
			data: {
			user_id: user.getUserId(),
			},
			dataType: 'json',
		});
	}

	function save(project) {
		return $.ajax({
			type: 'POST',
			url: host + '/api/project/save',
			data: project,
			dataType: 'json',
		});
	}

	function build(id) {
		return $.ajax({
			type: "POST",
			url: host + "/api/project/build",
			dataType: "json",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
		});
	}

	function remove(id) {
		return $.ajax({
			type: "POST",
			url: host + "/api/project/delete",
			data: {
				id: id,
				user_id: user.getUserId(),
			},
			dataType: "json",
		});
	}

	return {
		get: get,
		getAll: getAll,
		save: save,
		build: build,
		remove: remove,
	};
});
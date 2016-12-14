define(['vendor/jquery', 'app/config/config'], function($1, config) {

	function request(options) {
		if(config.target != "pc") {
			return $.ajax(options);
		}

		options.method = options.type;
		delete options.type;

		options.json = true;
		delete options.dataType;

		options.url = config.host + options.url + "?" + $.param(options.data);
		delete options.data;

		return kenrobot.postMessage("app:netRequest", options);
	}

	return {
		request: request,
	}
})
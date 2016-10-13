define(['app/util/emitor', 'app/config'], function(emitor, config) {
	var errors;
	var lastErrorTime;
	var counts;

	function init() {
		window.onerror = onAppError;

		errors = [];
		counts = {};

		emitor.on("app", "error", onAppError);
	}

	function onAppError(message, src, line, col, error) {
		var key = message + "-" + src + "-" + line + "-" + col;
		config.debug && console.error(error.stack || key);

		if(counts[key]) {
			counts[key]++;
			var myError = errors.find(function(e) {
				return e.message == message && e.src == src && e.line == line && e.col == col; 
			});
			myError.count = counts[key];
		} else {
			counts[key] = 1;
			errors.push({
				message: message,
				src: src,
				line: line,
				col: col,
				stack: error && error.stack || "",
				count: counts[key],
			});
		}
		
		var now = new Date().getTime();
		if (errors.length >= 10 || !lastErrorTime || lastErrorTime + 60 * 1000 < now) {
			report(errors);
			lastErrorTime = now;
			errors = [];
			counts = {};
		}

		return true;
	}

	function report(errors) {
		$.ajax({
			type: "POST",
			url: "/api/report/error",
			data: {
				error: JSON.stringify(errors)
			},
			dataType: "json",
		});
	}

	return {
		init: init,
	}
});
define(['vendor/jquery', 'app/util/emitor'], function($1, emitor) {
	var host;
	var API;
	var delay;
	var bitRate;
	var nameReg;
	var appId;

	function init(config) {
		delay = config.uploadDelay;
		bitRate = config.bitRate;
		nameReg = config.serialNameReg;
		appId = config.appId;

		host = window.location.protocol + "//" + window.location.host;
	}

	function check(triggerEvent) {
		var promise = $.Deferred();

		if (!getAPI()) {
			var p = promise.reject();
			triggerEvent && onCheckFail(1);
			return p;
		}

		sendMessage("ping", function(response) {
			if (response && response.action == "ping" && response.result == "pong") {
				promise.resolve();
			} else {
				promise.reject();
				triggerEvent && onCheckFail(2);
			}
		});

		return promise;
	}

	function upload(url, portPath) {
		var promise = $.Deferred();

		var onGetPortsDone = function(ports) {
			if (!portPath) {
				var arduinoPorts = filterArduinoPorts(ports, nameReg);
				var count = arduinoPorts.length;
				if (count == 0) {
					promise.reject(2);
					return;
				} else if(count > 1) {
					promise.reject(3, ports);
					return;
				}
				portPath = arduinoPorts[0].path;
			}
			connect(portPath, bitRate).done(function(connectionId) {
				url = host + url + "/hex";

				doUpload(connectionId, url, portPath, delay).done(function() {
					promise.resolve();
				}).fail(function() {
					promise.reject(5);
				});
			}).fail(function() {
				promise.reject(4);
			});
		};

		getPorts().done(onGetPortsDone).fail(function() {
			setTimeout(function() {
				getPorts().done(onGetPortsDone).fail(function() {
					promise.reject(1);
				});
			}, 1000);
		});

		return promise;
	}

	function sendMessage(message, callback) {
		callback = callback || function() {}
		API.runtime.sendMessage(appId, message, callback);
	}

	function filterArduinoPorts(ports, nameReg) {
		return ports.filter(function(port) {
			return nameReg.test(port.path) || (port.displayName && nameReg.test(port.displayName));
		});
	}

	function getPorts() {
		var promise = $.Deferred();

		sendMessage({
			action: "serial.getDevices"
		}, function(ports) {
			(!ports || ports.length == 0) ? promise.reject(): promise.resolve(ports);
		});

		return promise;
	}

	function connect(portPath, bitRate) {
		var promise = $.Deferred();

		sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: bitRate,
		}, function(connectionId) {
			connectionId ? promise.resolve(connectionId) : promise.reject();
		});

		return promise;
	}

	function doUpload(connectionId, url, portPath, delay) {
		var promise = $.Deferred();

		sendMessage({
			action: "upload",
			url: url,
			delay: delay,
		}, function(success) {
			disconnect(connectionId);
			success ? promise.resolve() : promise.reject();
		});

		return promise;
	}

	function disconnect(connectionId) {
		sendMessage({
			action: "serial.disconnect",
			connectionId: connectionId,
		});
	}

	function getAPI() {
		if (API != undefined) {
			return API;
		}

		API = isChrome() ? window.chrome : null;

		return API;
	}

	function isChrome() {
		return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	}

	function onCheckFail(code) {
		emitor.trigger("upload", "check-fail", code);
	}

	return {
		init: init,
		check: check,
		upload: upload,
	}
});
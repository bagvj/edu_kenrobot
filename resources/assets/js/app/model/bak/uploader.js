define(function() {
	var API;
	var config;
	var host;
	var nameReg = /(arduino)|(\/dev\/cu\.usbmodem)/i;

	function init(api, _config) {
		API = api;
		config = _config;
		host = window.location.protocol + "//" + window.location.host;
	}

	function upload(url, callback) {
		var doUpload = function(ports) {
			var port;
			for(var i = 0; i < ports.length; i++) {
				var p = ports[i];
				var name = p.displayName;
				if(name && nameReg.test(name)) {
					port = p;
					break;
				}
			}

			if(!port) {
				//没有arduino
				callback(2, ports);
				return;
			}

			resumeUpload(url, port.path, callback);
		};

		var first = true;
		var checkPorts = function() {
			sendMessage("serial.getDevices", function(ports) {
				if(!ports || ports.length == 0) {
					//没有串口连接
					if(first) {
						first = false;
						setTimeout(checkPorts, 1000);
					} else {
						callback(1);
					}
					return;
				}

				doUpload(ports);
			});
		}

		checkPorts();
	}

	function resumeUpload(url, portPath, callback) {
		sendMessage({
			action: "serial.connect",
			portPath: portPath,
			bitRate: config.bitRate,
		}, function(connectionId) {
			if(!connectionId) {
				callback(3);
				return;
			}

			sendMessage({
				action: "upload",
				url: host + url + "/hex",
				delay: config.uploadDelay,
			}, function(success) {
				sendMessage({
					action: "serial.disconnect",
					connectionId: connectionId,
				});

				callback(success ? 0 : 4);
			});
		});
	}

	function sendMessage(message, callback) {
		message = typeof message == "string" ? {action: message} : message;
		callback = callback || function() {}
		API.runtime.sendMessage(config.appId, message, callback);
	}

	return {
		init: init,
		upload: upload,
		resumeUpload: resumeUpload,
	};
});
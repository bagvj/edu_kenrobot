define(['../util', './uploader'], function(util, uploader) {
	var config;
	var API;

	function init(_config) {
		config = _config;
		API = getChromeAPI();

		uploader.init(API, config);

		var bit;
		if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
			bit = 64;
		} else {
			bit = 32;
		}
		var downloadUrl = "/download/arduino-driver-x" + bit + ".zip";
		$('.arduino-driver-dialog .downloadUrl').attr('href', downloadUrl);
	}

	function check(callback) {
		if(!isChrome() || !API) {
			util.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！");
			return;
		}

		checkExt(function(installed) {
			installed ? callback() : showInstallDialog();
		});
	}

	function isChrome() {
		return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	}

	function getChromeAPI() {
		if(!isChrome()) {
			return null;
		}

		return window.chrome;
	}

	function checkExt(callback) {
		API.runtime.sendMessage(config.appId, "ping", function(response) {
			if(response && response.action == "ping" && response.result == "pong") {
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	function showInstallDialog() {
		util.dialog(".install-dialog");
	}

	function upload(url, callback) {
		check(function() {
			uploader.upload(url, callback);
		});
	}

	return {
		init: init,
		upload: upload,
	}
});
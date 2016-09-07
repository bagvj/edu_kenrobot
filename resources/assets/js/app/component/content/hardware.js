define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {
	var region;

	function init() {

		emitor.on('app', 'start', onAppStart);
	}

	function getData() {
		return {};
	}

	function reset() {
		
	}

	function onAppStart() {

	}

	return {
		init: init,
		getData: getData,
		reset: reset,
	};
});
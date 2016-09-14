define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {
	var region;

	function init() {

		emitor.on('app', 'start', onAppStart);
	}

	function loadSchema(schema) {
		
	}

	function getData() {
		return {};
	}

	function setData() {

	}

	function reset() {
		
	}

	function onAppStart() {

	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		reset: reset,
	};
});
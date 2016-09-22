define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/codeModel'], function(_, util, emitor, codeModel) {
	var region;
	var container;

	function init() {
		region = $('.content-tabs .tab-code');
		container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on('app', 'start', onAppStart);
	}

	function getData() {
		return codeModel.getData();
	}

	function setData(data) {
		codeModel.setData(data);
	}

	function onAppStart() {

	}

	return {
		init: init,
		getData: getData,
		setData: setData,
	};
});
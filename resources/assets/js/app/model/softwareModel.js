define(['app/util/util', 'app/util/emitor', './block'], function(util, emitor, block) {
	var schema;

	function init(container) {

	}

	function loadSchema(_schema) {
		schema = _schema;
	}

	function getSchema() {
		return schema;
	}

	function getData() {

	}

	function setData(data) {

	}

	function getBlock(uid) {
		return block.getBlock(uid);
	}

	function removeBlock(uid) {
		block.removeBlock(uid);
	}

	function createBlock(data) {
		return block.createBlock(data);
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		loadSchema: loadSchema,
		getSchema: getSchema,
		createBlock: createBlock,
		getBlock: getBlock,
		removeBlock: removeBlock,
	}
});
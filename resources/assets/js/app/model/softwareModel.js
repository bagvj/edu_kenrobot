define(['app/util/util', 'app/util/emitor', './block'], function(util, emitor, block) {
	var schema;

	function init(container) {
		block.init(container);
	}

	function loadSchema(_schema) {
		schema = {
			blocks: {},
		};

		_schema.blocks.forEach(function(blockData) {
			schema.blocks[blockData.name] = blockData;
		});
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
		data = typeof data == "string" ? schema.blocks[data] : data;
		return block.createBlock(data);
	}

	function getBlockStructure(uid) {
		return block.getBlockStructure(uid);
	}

	function setBlockEnable(uid, value) {
		block.setBlockEnable(uid, value);
	}

	function copyBlock(uid, offsetX, offsetY) {
		return block.copyBlock(uid, offsetX, offsetY);
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
		copyBlock: copyBlock,
		getBlockStructure: getBlockStructure,
		setBlockEnable: setBlockEnable,
	}
});
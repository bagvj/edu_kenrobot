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

	function createBlock(data) {
		data = typeof data == "string" ? schema.blocks[data] : data;
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
	}
});
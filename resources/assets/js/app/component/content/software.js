define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/softwareModel'], function(_, util, emitor, softwareModel) {
	var region;
	var container;
	var filterList;
	var blockList;
	var filterWrap;

	function init() {
		var sidebarTab = $('.sidebar-tabs .tab-software');
		filterList = $('.filters', sidebarTab);
		blockList = $('.blocks', sidebarTab);
		filterWrap = $('.filter', sidebarTab);
		$('.advanced', filterWrap).on("click", onAdvancedClick).data("basic");

		$('> li', filterList).on('click', onFilterClick);

		region = $('.content-tabs .tab-software');
		container = $(".software-container", region);
		softwareModel.init(container[0]);

		emitor.on('app', 'start', onAppStart);
	}

	function loadSchema(schema) {
		softwareModel.loadSchema(schema);

		updateBlocks(schema.blocks);
	}

	function getData() {
		return softwareModel.getData();
	}

	function setData(data) {
		softwareModel.setData(data);
	}

	function reset() {

	}

	function updateBlocks(blocks) {
		blockList.empty();
		blocks.forEach(function(blockData) {
			var block = softwareModel.createBlock(blockData);
			var li = $('<li>').data("filter", blockData.tags.concat());
			blockList.append(li.append(block.dom));
		});
	}

	function onAppStart() {

	}

	function onFilterClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var filter = li.data('filter');
		$('.filter-name', filterWrap).text(li.text());
		$('.advanced', filterWrap).data('action', "basic");

		blockList.children().each(function(index, child) {
			var blockLi = $(child);
			var filters = blockLi.data("filter");
			(filters.indexOf(filter) >= 0 && filters.indexOf("advanced") < 0) ? blockLi.addClass("active"): blockLi.removeClass('active');
		});
	}

	function onAdvancedClick(e) {
		var li = filterList.find("li.active");
		if (!li.length) {
			return;
		}

		var advanced = $(".advanced", filterWrap);
		var isAdvanced;
		if (advanced.data("action") == "advanced") {
			advanced.data('action', "basic").val("高级");
			isAdvanced = false;
		} else {
			advanced.data("action", "advanced").val("基础");
			isAdvanced = true;
		}

		var filter = li.data('filter');
		blockList.children().each(function(index, child) {
			var blockLi = $(child);
			var filters = blockLi.data('filter');
			if(filters.indexOf(filter) < 0) {
				blockLi.removeClass('active');
				return;
			}

			var a = filters.indexOf("advanced") >= 0;
			((isAdvanced && a) || (!isAdvanced && !a)) ? blockLi.addClass("active") : blockLi.removeClass("active");
		});
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		reset: reset,
	};
});
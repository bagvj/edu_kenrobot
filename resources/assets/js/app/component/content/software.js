define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/softwareModel'], function(_, util, emitor, softwareModel) {
	var region;
	var container;
	var filterList;
	var blockList;
	var filterWrap;
	var contextMenuTarget;
	var blockContextMenu;

	function init() {
		var sidebarTab = $('.sidebar-tabs .tab-software');
		filterList = $('.filters', sidebarTab);
		blockList = $('.blocks', sidebarTab);
		filterWrap = $('.filter', sidebarTab);
		$('.advanced', filterWrap).on("click", onAdvancedClick).data("basic");

		$('> li', filterList).on('click', onFilterClick);

		region = $('.content-tabs .tab-software');
		container = $(".software-container", region);
		$('.block-group-region .group-header > span', region).on('click', onGroupHeaderClick);

		softwareModel.init(container[0]);

		blockContextMenu = $('.block-menu', region);
		$('> li', blockContextMenu).on('click', onBlockContextMenu);

		emitor.on('app', 'start', onAppStart);
		emitor.on('app', 'contextMenu', onContextMenu);
	}

	function loadSchema(schema) {
		softwareModel.loadSchema(schema);

		updateBlocks(schema.blocks);

		var globalBlock = softwareModel.createBlock("group");
		var setupBlock = softwareModel.createBlock("group");
		var loopBlock = softwareModel.createBlock("group");

		$('.block-global .group-extension', region).append(globalBlock.dom);
		$('.block-setup .group-extension', region).append(setupBlock.dom);
		$('.block-loop .group-extension', region).append(loopBlock.dom);
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
			if(blockData.type == "group" || blockData.tags.indexOf("module") >= 0) {
				return;
			}

			var block = softwareModel.createBlock(blockData);
			var li = $('<li>').data("filter", blockData.tags.concat());
			blockList.append(li.append(block.dom));
		});
	}

	function onAppStart() {

	}

	function onContextMenu(e) {		
		var target = $(e.target).closest(".block");
		if (target.length && !target.hasClass("block-group")) {
			contextMenuTarget = target;
			var offset = container.offset();
			var top = e.pageY - offset.top;
			var height = blockContextMenu.height();
			if (top + height > $(window).innerHeight()) {
				top = top - height;
			}
			blockContextMenu.css({
				display: 'block',
				left: 100 * (e.pageX - offset.left) / container.width() + "%",
				top: 100 * top / container.height() + "%",
			});
		}
	}

	function onBlockContextMenu(e) {
		if(!contextMenuTarget) {
			return;
		}

		var blockDom = contextMenuTarget[0];
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "copy":
				var copyBlock = softwareModel.copyBlock(blockDom.dataset.uid, offset, offset);
				container.appendChild(copyBlock.dom);
				break;
			case "comment":
				softwareModel.commentBlock(blockDom.dataset.uid);
				break;
			case "delete":
				softwareModel.removeBlock(blockDom.dataset.uid);
				break;
		}
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

	function onGroupHeaderClick(e) {
		var group = $(this).parent().parent();
		group.toggleClass("active");

		var blockDom = $(".group-extension > .block");
		var block = softwareModel.getBlock(blockDom.data("uid"));
		block.connectable = group.hasClass("active");
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		reset: reset,
	};
});
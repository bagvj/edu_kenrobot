define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/hardwareModel'], function($1, util, emitor, hardwareModel) {
	var region;
	var filterList;
	var componentList;
	var search;
	var container;
	var componentDialog;
	var componentContextMenu;
	var boardContextMenu;
	var contextMenuTarget;
	var componentTemplate = '<li data-filter="{{filter}}" data-label="{{label}}" data-name="{{name}}"><img class="image" draggable="true" src="{{src}}" /><div class="name">{{label}}</div></li>'

	function init() {
		var sidebarTab = $('.sidebar-tabs .tab-hardware');
		search = $('.search', sidebarTab);
		filterList = $('.filters', sidebarTab);
		componentList = $('.components', sidebarTab);

		search.on('keyup', onSearchKeyup).on('change', onSearchChange).on('blur', onSearchBlur);
		$('> li', filterList).on('click', onFilterClick);

		region = $('.content-tabs .tab-hardware');
		container = $('.hardware-container', region).on("dragover", onContainerDragOver).on("drop", onContainerDrop).on('containerEvent', onContainerEvent);
		hardwareModel.init(container[0]);

		componentDialog = $('.component-dialog', region);
		$('.name', componentDialog).on('blur', onComponentNameBlur);

		boardContextMenu = $('.board-menu', region);
		$('> li', boardContextMenu).on('click', onBoardContextMenu);
		componentContextMenu = $('.component-menu', region);
		$('> li', componentContextMenu).on('click', onComponentContextMenu);

		emitor.on('app', 'start', onAppStart);
		emitor.on('app', 'contextMenu', onContextMenu);
		emitor.on('hardware', 'boardChange', onBoardChange);
		emitor.on('hardware', 'resize', onResize);
	}

	function loadSchema(schema) {
		hardwareModel.loadSchema(schema);

		updateComponents(schema.components);
	}

	function getData() {
		return hardwareModel.getData();
	}

	function setData(hardwareData) {
		hardwareData = hardwareData || {};
		hardwareModel.setData(hardwareData);

		hideComponentDialog();
	}

	function reset() {

	}

	function updateComponents(components) {
		componentList.empty();
		components.forEach(function(component) {
			var li = componentTemplate.replace(/\{\{name\}\}/g, component.name)
				.replace(/\{\{label\}\}/g, component.label)
				.replace(/\{\{filter\}\}/, component.category)
				.replace(/\{\{src\}\}/, component.src);
			componentList.append(li);
		});
		$('> li .image', componentList).on('dragstart', onComponentDragStart).on('dragend', onComponentDragEnd);

		filterList.find('[data-filter="all"]').click();
	}

	function onAppStart() {

	}

	function onResize() {
		hardwareModel.repaint();
	}

	function onContextMenu(e) {
		var target = $(e.target);
		if (target.hasClass('component') && target.parents(container.selector).length) {
			contextMenuTarget = target;
			var offset = region.offset();
			var top = e.pageY - offset.top;
			var height = componentContextMenu.height();

			if (e.pageY + height > $(window).innerHeight()) {
				top = top - height;
			}
			componentContextMenu.addClass("active").css({
				left: e.pageX - offset.left,
				top: top,
			});
		} else if ((target.hasClass('board') || target.closest('.board').length) && target.parents(container.selector).length) {
			var offset = region.offset();
			boardContextMenu.addClass("active").css({
				left: e.pageX - offset.left,
				top: e.pageY - offset.top,
			});
		}
	}

	function onBoardContextMenu(e) {
		var li = $(this);
		var action = li.data('action');
		switch (action) {
			case "disconnect":
				hardwareModel.disconnectAllComponents();
				break;
			case "delete":
				hardwareModel.removeBoard();
				emitor.trigger("hardware", "removeBoard");
				break;
		}
	}

	function onComponentContextMenu(e) {
		if (!contextMenuTarget) {
			return;
		}

		var componentDom = contextMenuTarget[0];
		var li = $(this);
		var action = li.data('action');
		switch (action) {
			case "copy":
				var offset = 10;
				var x = 100 * (componentDom.offsetLeft + offset) / container.width();
				var y = 100 * (componentDom.offsetTop + offset) / container.height();
				var copyComponentDom = hardwareModel.addComponent({
					name: componentDom.dataset.name,
					x: x,
					y: y
				});
				hardwareModel.selectComponent(copyComponentDom);
				break;
			case "disconnect":
				hardwareModel.disconnectComponent(componentDom);
				break;
			case "delete":
				hardwareModel.removeComponent(componentDom);
				break;
		}
	}

	function onBoardChange(name) {
		hardwareModel.addBoard(name);
	}

	function onFilterClick(e) {
		var li = $(this);
		util.toggleActive(li);

		componentList.find("> li.active").removeClass("active");
		var filter = li.data('filter');
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.addClass("active");
	}

	function doComponentSearch() {
		var key = search.val().toLowerCase();
		if (!key) {
			return;
		}

		var filter = filterList.find("> li.active").data("filter");
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.each(function(i, item) {
			item = $(item);
			var label = item.data('label').toLowerCase();
			label.indexOf(key) >= 0 ? item.addClass("active") : item.removeClass("active");
		});
	}

	function doComponentFilter() {
		var filter = filterList.find("> li.active").data("filter");
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.addClass("active");
	}

	function onSearchKeyup(e) {
		e.keyCode == 13 && doComponentSearch();
	}

	function onSearchChange(e) {
		!search.val() && doComponentFilter();
	}

	function onSearchBlur(e) {
		doComponentSearch();
	}

	function onComponentDragStart(e) {
		var li = $(this).parent();
		e.originalEvent.dataTransfer.effectAllowed = 'move';
		e.originalEvent.dataTransfer.setData("name", li.data("name"));
		e.originalEvent.dataTransfer.setData("scope", "component");
		return true;
	}

	function onComponentDragEnd(e) {
		e.originalEvent.dataTransfer.clearData();
		return false;
	}

	function onContainerDragOver(e) {
		e.preventDefault();
		return true;
	}

	function onContainerDrop(e) {
		var scope = e.originalEvent.dataTransfer.getData("scope");
		var name = e.originalEvent.dataTransfer.getData("name");
		if (!scope || scope != "component" || !name) {
			return;
		}

		var schema = hardwareModel.getSchema();
		var component = schema.components[name];
		var x = 100 * (e.offsetX - 0.5 * component.width) / container.width();
		var y = 100 * (e.offsetY - 0.5 * component.height) / container.height();

		var componentDom = hardwareModel.addComponent({
			name: name,
			x: x,
			y: y
		});
		hardwareModel.selectComponent(componentDom);
		showComponentDialog(componentDom.dataset.uid);

		return false;
	}

	function hideComponentDialog() {
		componentDialog.removeClass("active").data("uid", "").find(".name").val("");
	}

	function showComponentDialog(uid) {
		var componentData = hardwareModel.getComponentData(uid);
		componentDialog.addClass("active").data("uid", uid).find(".name").val(componentData.varName);
	}

	function onContainerEvent(e) {
		if(e.originalEvent.action == "component-select") {
			showComponentDialog(e.originalEvent.data.uid);
		}
	}

	function onComponentNameBlur(e) {
		var uid = componentDialog.data("uid");
		var name = componentDialog.find(".name").val();
		var componentData = hardwareModel.getComponentData(uid);
		componentData.varName = name;
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		reset: reset,
	};
});
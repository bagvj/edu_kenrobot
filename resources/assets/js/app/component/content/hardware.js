define(['vendor/jquery', 'vendor/perfect-scrollbar', 'app/util/util', 'app/util/emitor', 'app/model/hardwareModel'], function($1, $2, util, emitor, hardwareModel) {
	var region;
	var filterList;
	var componentList;
	var search;
	var boardData;

	var container;
	var componentDialog;
	var componentContextMenu;
	var boardContextMenu;
	var contextMenuTarget;
	var componentTemplate = '<li data-filter="{{filter}}" data-label="{{label}}" data-name="{{name}}"><div class="image-wrap"><img class="image" draggable="false" src="{{src}}" /></div><div class="name">{{label}}</div></li>'

	var mouseDownComponentDom;
	var dragContainer;
	var dragComponentDom;
	var startPreMouseMove;
	var preMouseMoveX;
	var preMouseMoveY;
	var dragMouseX;
	var dragMouseY;

	function init() {
		var sidebarTab = $('.sidebar-tabs .tab-hardware');
		search = $('.search', sidebarTab);
		filterList = $('.filters', sidebarTab);
		componentList = $('.components', sidebarTab);
		componentList.parent().perfectScrollbar();

		search.on('keyup', onSearchKeyup).on('change', onSearchChange).on('blur', onSearchBlur);
		$('> li', filterList).on('click', onFilterClick);

		region = $('.content-tabs .tab-hardware');
		container = $('.hardware-container', region).on('containerEvent', onContainerEvent);
		hardwareModel.init(container[0]);
		dragContainer = $('.component-drag-layer')[0];

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
		emitor.on('sidebar', 'activeTab', onActiveTab);
	}

	function loadSchema(schema) {
		hardwareModel.loadSchema(schema);

		updateComponents(schema.components);
	}

	function getBoardData() {
		return boardData;
	}

	function getData() {
		return hardwareModel.getData();
	}

	function setData(hardwareData) {
		hardwareData = hardwareData || {};
		hardwareModel.setData(hardwareData);

		hideComponentDialog();
	}

	function getBlockData() {
		var data = {};
		var hardwareData = getData();
		data.components = hardwareData.components.map(function(componentData) {
			return hardwareModel.getComponentData(componentData.uid);
		});

		return data;
	}

	function reset() {

	}

	function updateComponents(components) {
		componentList.empty();
		components.forEach(function(component) {
			var li = componentTemplate.replace(/\{\{name\}\}/g, component.name)
				.replace(/\{\{label\}\}/g, component.label)
				.replace(/\{\{filter\}\}/, component.category)
				.replace(/\{\{src\}\}/, component.imageUrl);
			componentList.append(li);
		});
		[].forEach.call(componentList[0].querySelectorAll("li .image"), function(imageDom) {
			imageDom.addEventListener("mousedown", onComponentMouseDown);
			imageDom.addEventListener("touchstart", onComponentMouseDown);
		});

		filterList.find('[data-filter="all"]').click();
	}

	function onAppStart() {

	}

	function onActiveTab(name) {
		name == "hardware" ? dragContainer.classList.add("active") : dragContainer.classList.remove("active");
	}

	function onResize() {
		hardwareModel.repaint();
	}

	function onContextMenu(e) {
		var target = $(e.target);
		if (target.hasClass('component') && target.parents(container.selector).length) {
			contextMenuTarget = target;
			var offset = componentContextMenu.parent().offset();
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
			var offset = boardContextMenu.parent().offset();
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

	function onComponentMouseDown(e) {
		e.stopPropagation();
		e.returnValue = false;

		mouseDownComponentDom = e.currentTarget;
		startPreMouseMove = true;
		document.addEventListener("mouseup", onComponentMouseUpBeforeMove);
		document.addEventListener("touchend", onComponentMouseUpBeforeMove);
		document.addEventListener("mousemove", onComponentPreMouseMove);
		document.addEventListener("touchmove", onComponentPreMouseMove);
	}

	function onComponentMouseUpBeforeMove(e) {
		mouseDownComponentDom = null;
		document.removeEventListener("mouseup", onComponentMouseUpBeforeMove);
		document.removeEventListener("touchend", onComponentMouseUpBeforeMove);
		document.removeEventListener("mousemove", onComponentPreMouseMove);
		document.removeEventListener("touchmove", onComponentPreMouseMove);
	}

	function onComponentPreMouseMove(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		if (startPreMouseMove) {
			startPreMouseMove = false;
			preMouseMoveX = touch.pageX;
			preMouseMoveY = touch.pageY;

			var rect = mouseDownComponentDom.getBoundingClientRect();
			var containerRect = dragContainer.getBoundingClientRect();

			dragMouseX = touch.pageX - rect.left + containerRect.left - dragContainer.scrollLeft;
			dragMouseY = touch.pageY - rect.top + containerRect.top - dragContainer.scrollTop;
		} else {
			var distanceX = touch.pageX - preMouseMoveX;
			var distanceY = touch.pageY - preMouseMoveY;

			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener("mousemove", onComponentPreMouseMove);
				document.removeEventListener("touchmove", onComponentPreMouseMove);
				document.addEventListener("mousemove", onComponentMouseMove);
				document.addEventListener("touchmove", onComponentMouseMove);
			}
		}
	}

	function onComponentMouseMove(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		
		if (mouseDownComponentDom) {
			document.removeEventListener("mouseup", onComponentMouseUpBeforeMove);
			document.removeEventListener("touchend", onComponentMouseUpBeforeMove);
			document.addEventListener("mouseup", onComponentMouseUp);
			document.addEventListener("touchend", onComponentMouseUp);
			
			var li = $(mouseDownComponentDom).closest("li")[0];
			dragComponentDom = document.createElement("img");
			dragComponentDom.src = mouseDownComponentDom.src;
			dragComponentDom.dataset.name = li.dataset.name;
			dragComponentDom.classList.add("drag-component");
			dragContainer.appendChild(dragComponentDom);
			container.addClass("can-drop");

			mouseDownComponentDom = null;

			emitor.trigger("sidebar", "toggle");
		}

		dragComponentMove(dragComponentDom, touch.clientX, touch.clientY);
	}

	function onComponentMouseUp(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		document.removeEventListener("mousemove", onComponentMouseMove);
		document.removeEventListener("touchmove", onComponentMouseMove);
		document.removeEventListener("mouseup", onComponentMouseUp);
		document.removeEventListener("touchend", onComponentMouseUp);
		var name = dragComponentDom.dataset.name;
		dragComponentDom.remove();
		dragComponentDom = null;
		container.removeClass("can-drop");
		onContainerDrop(name, touch.pageX, touch.pageY);

		emitor.trigger("sidebar", "toggle");
	}

	function dragComponentMove(componentDom, clientX, clientY) {
		var offset = 30;

		var x = clientX - dragMouseX;
		var y = clientY - dragMouseY;
		if (x < 0) {
			x = 0;
		} else if (x + offset >= dragContainer.offsetWidth) {
			x = dragContainer.offsetWidth - offset;
		}
		if (y < 0) {
			y = 0;
		} else if (y + offset >= dragContainer.offsetHeight) {
			y = dragContainer.offsetHeight - offset;
		}

		componentDom.style.transform = "translate(" + x + "px, " + y + "px)";
	}

	function onContainerDrop(name, pageX, pageY) {
		var rect = container[0].getBoundingClientRect();
		if(pageX < rect.left || pageX > rect.right || pageY < rect.top || pageY > rect.bottom) {
			return;
		}

		var schema = hardwareModel.getSchema();
		var component = schema.components[name];
		var x = 100 * (pageX - rect.left - 0.5 * component.width) / container.width();
		var y = 100 * (pageY - rect.top - 0.5 * component.height) / container.height();

		var componentDom = hardwareModel.addComponent({
			name: name,
			x: x,
			y: y
		});
		hardwareModel.selectComponent(componentDom);
		showComponentDialog(componentDom.dataset.uid);
	}

	function onContainerEvent(e) {
		var action = e.originalEvent.action;
		if(action == "select-component") {
			showComponentDialog(e.originalEvent.data.uid);
		} else if(action == "remove-component") {
			var uid = e.originalEvent.data.uid;
			uid == componentDialog.data("uid") && hideComponentDialog();
		} else if(action == "remove-all-components") {
			hideComponentDialog();
		}
	}

	function onBoardChange(name) {
		boardData = hardwareModel.addBoard(name);
	}

	function onFilterClick(e) {
		var li = $(this);
		util.toggleActive(li);

		componentList.find("> li.active").removeClass("active");
		var filter = li.data('filter');
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.addClass("active");

		componentList.parent().perfectScrollbar("update");
	}

	function doComponentSearch() {
		var key = search.val().toLowerCase();
		if (!key) {
			return;
		}

		var filter = filterList.find("> li.active").data("filter");
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.removeClass("active").filter(function(i, item) {
			var li = $(item);
			return li.data('label').toLowerCase().indexOf(key) >= 0 || li.data('name').toLowerCase().indexOf(key) >= 0;
		}).addClass("active");

		componentList.parent().perfectScrollbar("update");
	}

	function doComponentFilter() {
		var filter = filterList.find("> li.active").data("filter");
		var list = filter == "all" ? componentList.find("> li") : componentList.find('> li[data-filter="' + filter + '"]');
		list.addClass("active");

		componentList.parent().perfectScrollbar("update");
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

	function onComponentNameBlur(e) {
		var uid = componentDialog.data("uid");
		var name = componentDialog.find(".name").val();
		var componentData = hardwareModel.getComponentData(uid);
		componentData.varName = name;
	}

	function hideComponentDialog() {
		componentDialog.removeClass("active").data("uid", "").find(".name").val("");
	}

	function showComponentDialog(uid) {
		var componentData = hardwareModel.getComponentData(uid);
		if(componentData.type == "serial") {
			hideComponentDialog();
			return;
		}

		componentDialog.addClass("active").data("uid", uid).find(".name").val(componentData.varName);
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		getBoardData: getBoardData,

		getBlockData: getBlockData,

		reset: reset,
	};
});
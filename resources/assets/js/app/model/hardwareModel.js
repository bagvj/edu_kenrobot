define(['vendor/jquery', 'vendor/jsPlumb'], function(_, _) {
	var config = {
		color: '#F1C933',
		colorHover: '#F19833',
		labelColor: 'white',
		font: '14px Microsoft YaHei',
	};

	var container;
	var dragComponentDom;
	var schema;
	var jsPlumbInstance;
	var board;
	var boardDom;

	function init(_container) {
		container = _container;
		boardDom = container.getElementsByClassName("board")[0];

		jsPlumbInstance = jsPlumb.getInstance();
		jsPlumbInstance.setContainer(container);

		jsPlumbInstance.importDefaults({
			DragOptions: {
				cursor: 'pointer',
				zIndex: 2000
			},
			DropOptions: {
				tolerance: 'touch',
				cursor: 'crosshair',
				hoverClass: 'drop-hover',
				activeClass: 'drag-active'
			},
			Connector: ['Flowchart', {
				cornerRadius: 5,
				alwaysRespectStubs: false,
				midpoint: 1,
				stub: [10, 40],
				gap: 2
			}],
			EndpointStyle: {
				fillStyle: config.color,
				strokeStyle: config.colorHover
			},
			EndpointHoverStyle: {
				fillStyle: config.colorHover
			},
			PaintStyle: {
				fillStyle: config.color,
				strokeStyle: config.color
			},
			HoverPaintStyle: {
				fillStyle: config.colorHover,
				strokeStyle: config.colorHover
			},
			LabelStyle: {
				font: config.font,
				color: config.labelColor,
			},
			MaxConnections: 1
		});
		jsPlumbInstance.registerConnectionTypes({
			'selected': {
				paintStyle: {
					strokeStyle: config.colorHover
				},
				hoverPaintStyle: {
					strokeStyle: config.colorHover
				}
			}
		});
		jsPlumbInstance.registerEndpointTypes({
			'selected': {
				paintStyle: {
					strokeStyle: config.colorHover,
					fillStyle: config.colorHover
				},
				hoverPaintStyle: {
					fillStyle: config.colorHover
				}
			}
		});
		jsPlumbInstance.registerEndpointTypes({
			'connected': {
				paintHoverStyle: {
					fillStyle: config.colorHover
				},
				endpointHoverStyle: {
					fillStyle: config.colorHover
				}
			}
		});

		connectionListeners();

		throttle(window, 'resize', 'optimizedResize');
		window.addEventListener('optimizedResize', function() {
			repaint();
		}, false);

		document.addEventListener('mouseup', onDomMouseUp);
	};

	function getSchema() {
		return schema;
	}

	function loadSchema(_schema) {
		schema = {
			boards: {},
			components: {},
		};

		_schema.boards.forEach(function(board) {
			schema.boards[board.name] = board;
		});

		_schema.components.forEach(function(component) {
			schema.components[component.name] = component;
		});
	}

	function setData(data) {
		data.board && addBoard(data.board);

		var components = data.components;
		components && components.forEach(function(component) {
			addComponent(component.name, component.x, component.y, component.endpoints);
		});

		var connections = data.connections;
		connections && connections.forEach(function(connection) {
			var endpoint = jsPlumbInstance.getEndpoint(connection.sourceUid);
			if (endpoint && endpoint.isFull()) {
				return;
			}

			jsPlumbInstance.connect({
				uuids: [connection.sourceUid, connection.targetUid],
				type: 'automatic'
			});
		});

		repaint();
	}

	function getData() {
		var data = {};
		data.board = board && board.name || null;

		data.components = [];
		var componentList = container.querySelectorAll('.component');
		componentList.forEach(function(componentDom) {
			var endpoints = jsPlumbInstance.getEndpoints(componentDom);
			if (!endpoints || !endpoints.length) {
				return
			}

			var connections = getConnections(componentDom);
			if (!connections || !connections.length) {
				return
			}

			var endpointsRef = {};
			endpoints.forEach(function(endpoint) {
				endpointsRef[endpoint.getParameter('pinComponent')] = {
					uid: endpoint.getUuid(),
					type: endpoint.scope
				};
			});

			data.components.push({
				name: componentDom.dataset.name,
				uid: componentDom.dataset.uid,
				x: Math.round(1000 * componentDom.offsetLeft / container.offsetWidth) / 10,
				y: Math.round(1000 * componentDom.offsetTop / container.offsetHeight) / 10,
				endpoints: endpointsRef,
				connected: connections.length > 0,
			});
		});

		data.connections = jsPlumbInstance.getAllConnections().map(function(connection) {
			var connectionParams = connection.getParameters();
			return {
				sourceUid: connectionParams.sourceUid,
				targetUid: connectionParams.targetUid
			};
		});

		return data;
	}

	function repaint() {
		setTimeout(function() {
			try {
				jsPlumbInstance.repaintEverything();
			} catch (e) {
				console.warn('repaint error', e);
			}
		}, 100);
	};

	function addBoard(name) {
		removeBoard();

		board = schema.boards[name];
		if(!board) {
			return;
		}

		boardDom.classList.add(board.name);
		board.pins.forEach(function(pin) {
			var epBoard = jsPlumbInstance.addEndpoint(boardDom, {
				anchor: [pin.x, pin.y, 0, -1, 0, 0],
				endpoint: ['Rectangle', {
					width: pin.rotate ? pin.height : pin.width,
					height: pin.rotate ? pin.width : pin.height,
				}],
				overlays: [
					['Label', {
						label: 'Pin ' + pin.name,
						labelStyle: {
							color: config.labelColor,
							font: config.font,
						},
						location: pin.overlay,
					}]
				],
				parameters: {
					pinBoard: pin.name
				},
				cssClass: 'board-endpoint pin-' + pin.name,
				isTarget: true,
				isSource: false,
				scope: pin.tags.join(" "),
				uuid: pin.uid
			});

			epBoard.unbind('click');
			epBoard.bind('click', onBoardEndpointClick);
		});
	};

	function removeBoard() {
		removeAllComponents();
		board && boardDom.classList.remove(board.name);
		jsPlumbInstance.removeAllEndpoints(boardDom);
		board = null;
	};

	function addComponent(name, x, y, _endpoints) {
		var component = schema.components[name];
		if(!component) {
			return;
		}

		var componentDom = document.createElement('img');
		container.appendChild(componentDom);

		componentDom.dataset.name = component.name;
		componentDom.dataset.uid = component.uid;
		componentDom.classList.add('component');
		componentDom.style.left = x + '%';
		componentDom.style.top = y + '%';
		componentDom.src = component.src;
		componentDom.style.width = component.width + 'px';
		componentDom.style.height = component.height + 'px';
		componentDom.draggable = true;
		componentDom.addEventListener('mousedown', onComponentMouseDown);

		container.querySelectorAll('.component-endpoint').forEach(function(endpoint) {
			endpoint.classList.remove('selected');
		});

		var endpoints = _endpoints || {};
		component.pins.forEach(function(pin) {
			var type = pin.tags.join(" ");
			!_endpoints && (endpoints[pin.name] = {
				type: type,
				uid: jsPlumbUtil.uuid()
			});

			var epComponent = jsPlumbInstance.addEndpoint(componentDom, {
				anchor: pin.anchor,
				uuid: endpoints[pin.name].uid,
				parameters: {
					pinComponent: pin.name,
					type: type,
				},
				endpoint: ['Dot', {
					radius: 7
				}],
				isSource: true,
				isTarget: false,
				cssClass: 'component-endpoint',
				hoverClass: 'component-endpoint--hover',
				connectorStyle: {
					strokeStyle: config.color,
					fillStyle: 'transparent',
					lineWidth: 5,
					joinstyle: 'round',
					outlineWidth: 1,
					outlineColor: '#EBEBEB'
				},
				connectorHoverStyle: {
					strokeStyle: config.colorHover
				}
			}, {
				scope: type
			});
			epComponent.canvas.classList.add('selected');
			epComponent.unbind('click');
			epComponent.bind('click', onComponentEndpointClick);

			if(!pin.spec) {
				return;
			}

			var epBoardDom = container.querySelector(".board-endpoint.pin-" + pin.spec);
			if(!epBoardDom) {
				return;
			}

			var epBoard = epBoardDom._jsPlumb;
			epBoard.detachAll();
			jsPlumbInstance.connect({
				uuids: [epComponent.getUuid(), epBoard.getUuid()],
				type: "automatic",
			});
		});

		jsPlumbInstance.draggable(componentDom, {
			containment: true
		});

		repaint();

		return componentDom;
	};

	function removeComponent(componentDom) {
		componentDom.removeEventListener('mousedown', onComponentMouseDown);

		getConnections(componentDom).forEach(function(connection) {
			connection.setType('removing');
		});
		jsPlumbInstance.detachAllConnections(componentDom);
		jsPlumbInstance.remove(componentDom);
	};

	function selectComponent(componentDom) {
		container.querySelectorAll('.component').forEach(function(_componentDom) {
			_componentDom.classList.remove('selected');
		});
		componentDom.classList.add("selected");
	}

	function disconnectComponent(componentDom) {
		jsPlumbInstance.select({
			source: componentDom.id
		}).detach();
	};

	function disconnectAllComponents() {
		jsPlumbInstance.detachAllConnections(boardDom);
	};

	function removeAllComponents() {
		jsPlumbInstance.deleteEveryEndpoint();
		var components = container.querySelectorAll('.component');
		components.forEach(function(componentDom) {
			componentDom.removeEventListener('mousedown', onComponentMouseDown);
			jsPlumb.remove(componentDom);
		});
	};

	function removeSelectedConnection() {
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			if (connection.hasType('selected')) {
				connection.endpoints.forEach(function(endpoint) {
					endpoint.removeType('selected');
					endpoint.removeClass('selected');
				});
				jsPlumbInstance.detach(connection);
			}
		});
	};

	function unselectAllConnections() {
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			connection.removeType('selected');
			connection.canvas.classList.remove('selected');
			connection.endpoints.forEach(function(endpoint) {
				endpoint.removeType('selected');
				endpoint.canvas.classList.remove('selected');
			});
		});
	}

	function onComponentMouseDown() {
		var componentDom = this;
		dragComponentDom = componentDom;

		unselectAllConnections();

		container.querySelectorAll('.component').forEach(function(com) {
			com.classList.remove('selected');
		});

		container.querySelectorAll('.component-endpoint').forEach(function(endpoint) {
			endpoint.classList.remove('selected');
		});

		componentDom.classList.add("selected");
		jsPlumbInstance.selectEndpoints({
			source: componentDom
		}).addClass('selected');

		getConnections(componentDom).forEach(selectConnection);
	}

	function onDomMouseUp() {
		if (!dragComponentDom) {
			return;
		}

		dragComponentDom.style.left = ((dragComponentDom.offsetLeft * 100) / container.offsetWidth) + '%';
		dragComponentDom.style.top = ((dragComponentDom.offsetTop * 100) / container.offsetHeight) + '%';
		dragComponentDom = null;
	}

	function connectionListeners() {
		jsPlumbInstance.unbind('click');
		jsPlumbInstance.unbind('connection');
		jsPlumbInstance.unbind('connectionDetached');

		var connectionEvent = new CustomEvent('connectionEvent');
		jsPlumbInstance.bind('connection', function(connection) {
			connection.targetEndpoint.setType('connected');
			connection.sourceEndpoint.setType('connected');

			connection.connection.setParameters({
				sourceUid: connection.sourceEndpoint.getUuid(),
				targetUid: connection.targetEndpoint.getUuid()
			});
			var pinAssignation = {};
			pinAssignation[connection.sourceEndpoint.getParameter('pinComponent')] = connection.targetEndpoint.getParameter('pinBoard');

			var componentData = {
				uid: connection.source.dataset.uid,
				connections: [connection.connection],
				pin: pinAssignation
			};

			connection.connection.bind('click', function(c) {
				unselectAllConnections();
				selectConnection(c);
			});

			connectionEvent.componentData = componentData;
			connectionEvent.protoBoLaAction = 'attach';
			connectionEvent.protoBoLaActionParent = connection.connection.hasType('undoredo') || connection.connection.hasType('removing') || connection.connection.getData().undoredo;

			if (connection.target.classList.contains('board')) {
				container.dispatchEvent(connectionEvent);
			}
		});

		jsPlumbInstance.bind('connectionDetached', function(connection) {
			connection.targetEndpoint.removeType('connected');
			connection.sourceEndpoint.removeType('connected');

			var pinAssignation = {};
			pinAssignation[connection.sourceEndpoint.getParameter('pinComponent')] = undefined;

			var componentData = {
				uid: connection.source.dataset.uid,
				id: connection.source.dataset.id,
				category: connection.source.dataset.category,
				pin: pinAssignation,
				connections: [connection.connection]
			};

			unselectConnection(connection.connection);

			connection.connection.unbind('click');

			connectionEvent.componentData = componentData;
			connectionEvent.protoBoLaAction = 'detach';
			connectionEvent.protoBoLaActionParent = connection.connection.hasType('undoredo') || connection.connection.hasType('removing') || connection.connection.getData().undoredo;

			if (connection.target.classList.contains('board')) {
				container.dispatchEvent(connectionEvent);
			}
		});

		jsPlumbInstance.bind('connectionMoved', function(connection) {
			connection.originalTargetEndpoint.removeType('selected');
			connection.originalTargetEndpoint.removeClass('selected');
			connection.originalTargetEndpoint.removeClass('endpointDrag');
		});
	}

	function onBoardEndpointClick(endpoint) {
		if (endpoint.hasType('selected')) {
			return false;
		}
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			connection.removeType('selected');
			connection.endpoints.forEach(function(ep) {
				ep.removeType('selected');
			});
		});

		endpoint.connections.forEach(function(connection) {
			connection.setType('selected');
			connection.endpoints.forEach(function(ep) {
				ep.setType('selected');
			});
		});
	}

	function onComponentEndpointClick(endpoint) {
		endpoint.canvas.classList.add('selected');
		unselectAllConnections();

		if (endpoint.hasType('selected')) {
			return false;
		}

		endpoint.connections.forEach(selectConnection);
	}

	function selectConnection(connection) {
		if (connection.hasType('selected')) {
			return false;
		}

		connection.setType('selected');
		connection.canvas.classList.add('selected');
		connection.endpoints.forEach(function(endpoint) {
			endpoint.setType('selected');
			endpoint.canvas.classList.add('selected');
		});
	}

	function unselectConnection(connection) {
		connection.removeType('selected');
		connection.canvas.classList.remove('selected');
		connection.endpoints.forEach(function(endpoint) {
			endpoint.removeType('selected');
			endpoint.canvas.classList.remove('selected');
		});
	}

	function getConnections(componentDom) {
		return jsPlumbInstance.getAllConnections().filter(function(connection) {
			return connection.sourceId == componentDom.id || connection.targetId == componentDom.id;
		});
	}

	function throttle(target, type, name) {
		var running = false;
		var func = function() {
			if (running) {
				return;
			}
			running = true;
			requestAnimationFrame(function() {
				target.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		target.addEventListener(type, func);
	};

	return {
		init: init,

		getSchema: getSchema,
		loadSchema: loadSchema,

		repaint: repaint,

		getData: getData,
		setData: setData,

		addBoard: addBoard,
		removeBoard: removeBoard,

		addComponent: addComponent,
		removeComponent: removeComponent,
		selectComponent: selectComponent,

		disconnectComponent: disconnectComponent,
		disconnectAllComponents: disconnectAllComponents,
		removeAllComponents: removeAllComponents,

		removeSelectedConnection: removeSelectedConnection,
		unselectAllConnections: unselectAllConnections,
	}
});
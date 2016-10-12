define(function() {
	var utils = blocksUtils,
		lang = 'zh',
		connectors = {},
		ioConnectors = {},
		blocks = {},
		availableConnectors = [],
		availableioConnectors = [],
		$field = null,
		scrollTop = 0,
		forcedScrollTop = null,
		softwareArrays = {
			voidFunctions: [],
			returnFunctions: [],
			softwareVars: [],
			classes: [],
			objects: []
		},
		dragPreviousTopPosition,
		dragPreviousLeftPosition,
		dragBlockMousePositionX,
		dragBlockMousePositionY,
		//we cant get the offset if the element its not visible, to avoid calc them on each drag, set them here
		fieldOffsetTop,
		//to relative fields
		fieldOffsetLeft = 0, //Bitblock value 70,
		fieldOffsetTopSource = [], //bitblock value['header', 'nav--make', 'actions--make', 'tabs--title'],
		fieldOffsetTopForced = 0,
		mouseDownBlock = null,
		draggingBlock = null,
		startPreMouseMove = null,
		preMouseMoveX,
		preMouseMoveY;

	var setOptions = function(options) {
		fieldOffsetTopSource = options.fieldOffsetTopSource || [];
		fieldOffsetLeft = options.fieldOffsetLeft || 0;
		fieldOffsetTopForced = options.fieldOffsetTopForced || 0;

		if ((options.forcedScrollTop === 0) || options.forcedScrollTop) {
			forcedScrollTop = options.forcedScrollTop;
		}

		lang = options.lang || 'zh';
	};

	var getFieldOffsetTop = function(source) {
		var fieldOffsetTop = 0;
		if (fieldOffsetTopForced) {
			fieldOffsetTop = fieldOffsetTopForced;
		} else {
			var tempElement;
			for (var i = 0; i < source.length; i++) {
				tempElement = document.getElementsByClassName(source[i]);
				if (tempElement[0]) {
					fieldOffsetTop += tempElement[0].clientHeight;
				}
			}
		}

		return fieldOffsetTop;
	};

	var blockMouseDown = function(evt) {
		//console.log('blockMouseDown');
		//console.log(evt.target.tagName);
		if (evt.target.tagName !== 'SELECT') {
			//to avoid mousemove event on children and parents at the same time
			evt.stopPropagation();

			mouseDownBlock = evt.currentTarget;
			startPreMouseMove = true;
			document.addEventListener('mousemove', blockPreMouseMove);
			document.addEventListener('mouseup', blockMouseUpBeforeMove);
		}
	};

	var blockMouseUpBeforeMove = function() {
		//console.log('blockMouseUpBeforeMove');
		mouseDownBlock = null;
		document.removeEventListener('mousemove', blockPreMouseMove);
		document.removeEventListener('mouseup', blockMouseUpBeforeMove);
	};

	//to avoid move blocks with a 1 px movement
	var blockPreMouseMove = function(evt) {
		if (startPreMouseMove) {
			preMouseMoveX = evt.pageX;
			preMouseMoveY = evt.pageY;
			startPreMouseMove = false;

			//we take values to the blocksMouseMove from the first move
			var position = mouseDownBlock.getBoundingClientRect();

			//mouse position respect block
			dragBlockMousePositionX = evt.pageX - position.left;
			dragBlockMousePositionY = evt.pageY - position.top;

			//the mouse position its relative to the document, we need the top offset from header
			fieldOffsetTop = getFieldOffsetTop(fieldOffsetTopSource);

			//position to control the translate and the distance
			dragPreviousTopPosition = position.top;
			dragPreviousLeftPosition = position.left;

			//to add the scroll to the mouse positions
			scrollTop = $field[0].scrollTop;
		} else {

			var distanceX = evt.pageX - preMouseMoveX,
				distanceY = evt.pageY - preMouseMoveY;

			//console.log('distance', Math.abs(distanceX), Math.abs(distanceY));
			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener('mousemove', blockPreMouseMove);
				document.addEventListener('mousemove', blockMouseMove);
			}
		}
	};

	var blockMouseMove = function(evt) {
		//console.log('blockMouseMove');
		var block = null;
		//actions to do before start to move
		if (mouseDownBlock) {
			block = blocks[mouseDownBlock.getAttribute('data-block-id')];

			if (!block.isConnectable()) {
				//console.log('its not connectable');
				block.doConnectable();
				$field.append(block.dom);
			}
			document.removeEventListener('mouseup', blockMouseUpBeforeMove);
			document.addEventListener('mouseup', blockMouseUp);

			mouseDownBlock.className = mouseDownBlock.className.concat(' dragging');

			switch (block.data.type) {
				case 'statement':
				case 'statement-input':
					statementDragStart(block);
					break;
				case 'output':
					outputDragStart(block);
					break;
				case 'group':
					throw 'Group cant be moved';
				default:
					throw 'Not defined block dragstart!!';
			}
			mouseDownBlock = null;
			draggingBlock = block;
		}

		block = block || draggingBlock;
		var distance = moveBlock(block, evt.clientX, evt.clientY);

		switch (block.data.type) {
			case 'statement':
			case 'statement-input':
				utils.redrawTree(block, blocks, connectors);
				if (distance > 10) {
					handleCollisions([block.connectors[0], utils.getLastBottomConnectorUid(block.uuid, blocks, connectors)], evt);
				}
				break;
			case 'output':
				if (distance > 10) {
					handleIOCollisions(block, availableioConnectors);
				}
				break;
			default:
				throw 'Not defined block drag!!';
		}

	};

	var blockMouseUp = function() {
		//console.log('blockMouseUp');
		scrollTop = 0;
		var $dropConnector = $('.connector.available').first(),
			block = draggingBlock;

		if ($dropConnector[0]) {

			switch (block.data.type) {
				case 'statement':
				case 'statement-input':
					statementDragEnd(block, $dropConnector);
					break;
				case 'output':
					outputDragEnd(block, $dropConnector);
					break;
				default:
					throw 'Not defined block drag!!';
			}
			window.dispatchEvent(new Event('blocks:connect'));

			if (!block.dom.closest('.block--group')[0]) {
				block.disable();
				if ((block.data.type === 'statement') || (block.data.type === 'statement-input')) {
					utils.executeFunctionOnConnectedStatementBlocks('disable', block, blocks, connectors);
				}
			} else {
				block.enable();
				if ((block.data.type === 'statement') || (block.data.type === 'statement-input')) {
					utils.executeFunctionOnConnectedStatementBlocks('enable', block, blocks, connectors);
				}
			}
		} else {
			block.disable();
			if ((block.data.type === 'statement') || (block.data.type === 'statement-input')) {
				utils.executeFunctionOnConnectedStatementBlocks('disable', block, blocks, connectors);
			}

		}
		availableConnectors = [];
		availableioConnectors = [];
		$('.block').removeClass('dragging');
		$('.connector.available').removeClass('available');
		$('.block--dragging').removeClass('block--dragging');
		$field.focus();
		window.dispatchEvent(new Event('blocks:dragend'));

		draggingBlock = null;
		dragPreviousTopPosition = 0;
		dragPreviousLeftPosition = 0;

		document.removeEventListener('mousemove', blockMouseMove);
		document.removeEventListener('mouseup', blockMouseUp);
	};

	var statementDragStart = function(block) {

		var previousConnector = connectors[block.connectors[0]].connectedTo;

		if (previousConnector) {
			var previousBlock = blocks[connectors[previousConnector].blockUid];

			var isInsideConnectorRoot = utils.isInsideConnectorRoot(block, blocks, connectors);

			//desenganchamos
			connectors[previousConnector].connectedTo = null;
			connectors[block.connectors[0]].connectedTo = null;

			//miramos si estaba enganchado a un connector-root para sacarlo del parent
			if (isInsideConnectorRoot) {

				//setTimeout(function() {
				if (previousBlock.data.type === 'group') {
					//remove class that show help on group blocks
					previousBlock.dom.removeClass('with--content');
				}
				removeFromStatementInput(block);
				utils.redrawTree(previousBlock, blocks, connectors);
				// }, 0);

			}
		}

		availableConnectors = [];

		for (var connectorUid in connectors) {

			if (connectors[connectorUid].data.type !== 'connector-empty') {
				if (utils.getBlockByConnector(connectorUid, blocks, connectors).isConnectable()) {
					if (!utils.connectorIsInBranch(connectorUid, block.uuid, blocks, connectors)) {
						availableConnectors.push(connectorUid);
					}
				}
			}
		}
	};

	var removeFromStatementInput = function(firstBlockToRemove) {
		var $totalBlocksToRemove = [firstBlockToRemove.dom];
		var childConnectorUid = connectors[firstBlockToRemove.connectors[1]].connectedTo,
			blockToRemove,
			top = firstBlockToRemove.dom.outerHeight(true);

		firstBlockToRemove.dom.removeClass('inside-block');
		while (childConnectorUid) {
			blockToRemove = blocks[connectors[childConnectorUid].blockUid];
			$totalBlocksToRemove.push(blockToRemove.dom);
			blockToRemove.dom.removeClass('inside-block');
			blockToRemove.dom[0].style.transform = 'translate(' + 0 + 'px,' + top + 'px)';
			top += blockToRemove.dom.outerHeight(true);
			childConnectorUid = connectors[blockToRemove.connectors[1]].connectedTo;
		}
		utils.appendArrayInOneTime($field, $totalBlocksToRemove);

	};

	var outputDragStart = function(block) {
		var outputConnector = utils.getOutputConnector(block, ioConnectors);
		if (outputConnector.connectedTo) {
			block.dom.removeClass('nested-block');

			var blockConnector = ioConnectors[outputConnector.connectedTo],
				oldBlock = blocks[blockConnector.blockUid];

			//remove the logical conexions
			blockConnector.connectedTo = null;
			outputConnector.connectedTo = null;

			if (oldBlock.data.returnType && (oldBlock.data.returnType.type === 'fromInput')) {
				updateSoftVar(oldBlock);
			}

			$field[0].appendChild(block.dom[0]);
		}

		//store the available connectors
		availableioConnectors = [];
		for (var connectorUid in ioConnectors) {
			if (ioConnectors[connectorUid].data.type === 'connector-input') {
				if (utils.getBlockByConnector(connectorUid, blocks, ioConnectors).isConnectable()) {
					if (!ioConnectors[connectorUid].connectedTo) {
						if (utils.sameConnectionType(block, utils.getBlockByConnector(connectorUid, blocks, ioConnectors), ioConnectors[connectorUid].data.acceptType, blocks, ioConnectors, softwareArrays)) {
							if (!utils.connectorIsInBranch(connectorUid, block.uuid, blocks, ioConnectors)) {
								availableioConnectors.push(connectorUid);
							}
						}
					}
				}
			}
		}

		// console.log('availableioConnectors',availableioConnectors);
	};

	var moveBlock = function(block, clientX, clientY) {
		var position = block.dom[0].getBoundingClientRect(),
			distance = Math.round(Math.sqrt(Math.pow(dragPreviousTopPosition - position.top, 2) + Math.pow(dragPreviousLeftPosition - position.left, 2))),
			x,
			y,
			destinationX,
			destinationY;
		if (scrollTop !== $field[0].scrollTop) {
			scrollTop = $field[0].scrollTop;
		}

		if (forcedScrollTop !== null) {
			scrollTop = forcedScrollTop;
		}

		x = clientX - fieldOffsetLeft;
		y = clientY - fieldOffsetTop + scrollTop;

		destinationX = (x - dragBlockMousePositionX);
		destinationY = (y - dragBlockMousePositionY);

		block.dom[0].style.transform = 'translate(' + destinationX + 'px,' + destinationY + 'px)';
		if (distance > 10) {
			dragPreviousTopPosition = position.top;
			dragPreviousLeftPosition = position.left;
		}
		if (block.data.type === 'statement-input') {
			utils.redrawTree(block, blocks, connectors);
		}

		return distance;
	};

	var statementDragEnd = function(block, $dropConnector) {

		var dropConnectorUid = $dropConnector.attr('data-connector-id');
		var dragConnectorUid = $('[data-connector-id="' + dropConnectorUid + '"]').attr('data-canconnectwith');

		//console.log('dragConnectorUid', dragConnectorUid);
		//console.log('dropUid', dropConnectorUid);
		var areDroppingInsideABlock = utils.isConnectorRoot(connectors[dropConnectorUid]) || utils.isInsideConnectorRoot(utils.getBlockByConnector(dropConnectorUid, blocks, connectors), blocks, connectors);

		//console.log('areDroppingInsideABlock?', areDroppingInsideABlock);

		setLogicConnection(dropConnectorUid, dragConnectorUid);
		if (areDroppingInsideABlock) {
			connectorRootDragEnd(block, $dropConnector);
		} else {
			placeNestBlock(dropConnectorUid, dragConnectorUid);
		}

	};

	var connectorRootDragEnd = function(dragBlock, $dropConnector) {
		//console.log('connectorRootDragEnd');
		var dropConnectorUid = $dropConnector.attr('data-connector-id');
		var dropBlock = blocks[connectors[dropConnectorUid].blockUid];

		dragBlock.dom.addClass('inside-block');
		dragBlock.dom.removeAttr('style');

		if (utils.isConnectorRoot(connectors[dropConnectorUid])) {
			var $dropContainer = dropBlock.dom.find('.block--extension__content');
			$dropContainer.first().append(dragBlock.dom);
			dropBlock.dom.addClass('with--content');
		} else {
			dropBlock.dom.after(dragBlock.dom);
		}

		//var childNodes

		var somethingConnectedInBottomUid = connectors[dragBlock.connectors[1]].connectedTo;
		var branchBlock;
		var childNodes = [];
		while (somethingConnectedInBottomUid) {
			branchBlock = blocks[connectors[somethingConnectedInBottomUid].blockUid];
			childNodes.push(branchBlock.dom);
			branchBlock.dom.addClass('inside-block');
			branchBlock.dom.removeAttr('style');

			somethingConnectedInBottomUid = connectors[branchBlock.connectors[1]].connectedTo;

		}
		dragBlock.dom.after(utils.jqueryObjectsArrayToHtmlToInsert(childNodes));

		//se repinta el arbol donde esta el dropblock, porq cambiara de tamaño
		utils.redrawTree(dropBlock, blocks, connectors);
	};

	var outputDragEnd = function(block, $dropConnector) {
		var dropConnectorUid = $dropConnector.attr('data-connector-id');
		var dragConnectorUid = utils.getOutputConnector(block, ioConnectors).uuid;

		$dropConnector.append(block.dom);
		block.dom.addClass('nested-block').removeAttr('style');

		ioConnectors[dropConnectorUid].connectedTo = dragConnectorUid;
		ioConnectors[dragConnectorUid].connectedTo = dropConnectorUid;

		var dropBlock = utils.getBlockByConnector(dropConnectorUid, blocks, ioConnectors);
		var dragBlock = utils.getBlockByConnector(dragConnectorUid, blocks, ioConnectors);

		if (dropBlock.data.returnType && (dropBlock.data.returnType.type === 'fromInput')) {
			if (!dragBlock.data.returnType.pointer) {
				updateSoftVar(dropBlock);
			}
		}
	};

	var handleCollisions = function(dragConnectors) {
		var i,
			found,
			$dropConnector,
			$dragConnector,
			tempBlock;

		// For each available connector
		availableConnectors.forEach(function(dropConnectorUid) {
			$dropConnector = connectors[dropConnectorUid].jqueryObject;
			i = 0;
			found = false;
			while (!found && (i < dragConnectors.length)) {
				$dragConnector = connectors[dragConnectors[i]].jqueryObject;

				if ((connectors[dragConnectors[i]].data.type === connectors[dropConnectorUid].data.accept) && utils.itsOver($dragConnector, $dropConnector, 20)) {
					found = true;
				} else {
					i++;
				}
			}
			tempBlock = utils.getBlockByConnector(dropConnectorUid, blocks, connectors);
			if (found) {
				$dropConnector.addClass('available');
				$dropConnector.attr('data-canconnectwith', dragConnectors[i]);

				if (tempBlock.data.type === 'group') {
					tempBlock.dom.addClass('block--dragging');
				}
			} else {
				if (tempBlock.data.type === 'group') {
					tempBlock.dom.removeClass('block--dragging');
				}
				$dropConnector.removeClass('available');
				$dropConnector.removeAttr('data-canconnectwith');
			}
		});
	};

	var handleIOCollisions = function(block, availableioConnectors) {
		var dropConnector;
		var dragConnector = utils.getOutputConnector(block, ioConnectors);
		availableioConnectors.forEach(function(dropConnectorUid) {
			dropConnector = ioConnectors[dropConnectorUid];
			if (utils.itsOver(dragConnector.jqueryObject, dropConnector.jqueryObject, 0) && utils.sameConnectionType(blocks[dragConnector.blockUid], blocks[dropConnector.blockUid], dropConnector.data.acceptType, blocks, ioConnectors, softwareArrays)) {
				dropConnector.jqueryObject.addClass('available');
			} else {
				dropConnector.jqueryObject.removeClass('available');

			}
		});
	};

	var setLogicConnection = function(dropConnectorUid, dragConnectorUid) {
		//console.log('conectamos', dropConnectorUid, connectors[dropConnectorUid].data.type, 'con ', dragConnectorUid, connectors[dragConnectorUid].data.type);
		//console.log('conectado con', connectors[dropConnectorUid].connectedTo, 'y el otro con', connectors[dragConnectorUid].connectedTo);
		if (connectors[dropConnectorUid].connectedTo) {
			var dropBottomConnectorUid, dragBlockLastBottomConnectorUid, dropTopConnectorUid, dragBlockFirstTopConnectorUid;
			switch (connectors[dropConnectorUid].data.type) {
				case 'connector-bottom':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = utils.getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid, blocks, connectors);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
				case 'connector-top':
					dropTopConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockFirstTopConnectorUid = utils.getFirstTopConnectorUid(connectors[dragConnectorUid].blockUid, blocks, connectors);
					connectors[dropTopConnectorUid].connectedTo = dragBlockFirstTopConnectorUid;
					connectors[dragBlockFirstTopConnectorUid].connectedTo = dropTopConnectorUid;
					break;
				case 'connector-root':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = utils.getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid, blocks, connectors);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
				default:
					throw 'connector on setLogicConnection no handled ' + connectors[dropConnectorUid].data.type;
			}
		}
		connectors[dropConnectorUid].connectedTo = dragConnectorUid;
		connectors[dragConnectorUid].connectedTo = dropConnectorUid;
	};

	var placeNestBlock = function(dropConnectorUid, dragConnectorUid) {
		//console.log('Nest');

		var dropBlock = blocks[connectors[dropConnectorUid].blockUid];
		//console.log(dropBlock, dragBlock);

		switch (dropBlock.data.type) {
			case 'statement':
			case 'statement-input':
				utils.redrawTree(utils.getBlockByConnector(dragConnectorUid, blocks, connectors), blocks, connectors);
				break;
			case 'output':
				break;
			default:
				throw 'blocktype not defined in nesting ' + dropBlock.data.type;
		}
	};

	var updateSoftVar = function(block, name, type, args) {
		var dynamicContentType = block.data.createDynamicContent;
		//console.log('updating softVar', dynamicContentType);
		if (!dynamicContentType) {
			throw 'We are adding a softVar on a block that not defined the dynamic content';
		}
		if (!softwareArrays[dynamicContentType]) {
			throw 'dynamicContentType not defined ' + block.data.name;
		}
		var found = false,
			i = 0;
		while (!found && (i < softwareArrays[dynamicContentType].length)) {
			if (softwareArrays[dynamicContentType][i].blockUid === block.uuid) {
				found = true;
			}
			i++;
		}
		type = type || utils.getTypeFromBlock(block, blocks, ioConnectors, softwareArrays);
		//arguments if any:
		if (block.data.type === 'statement-input' && block.data.arguments) {
			args = args || utils.getArgsFromBlock(block, blocks, ioConnectors);
		} else {
			args = '';
		}
		var softVar;
		if (found) {
			softVar = softwareArrays[dynamicContentType][i - 1];
			softVar.name = name || softVar.name;
			softVar.type = type;
			softVar.args = args;
			if (softVar.name) {
				//cambiar data-value cuando el valor sea el mismo que el de la variable que se cambia
				// $('select[data-varreference=' + softVar.id + ']').attr({
				//     'data-value': softVar.name
				// });
				$('option[data-var-id="' + softVar.id + '"]').attr({
					value: softVar.name
				}).html(softVar.name);

			} else {
				removeSoftVar(block);
			}

		} else {
			if (name) {
				softVar = {
					name: name,
					id: utils.generateUUID(),
					blockUid: block.uuid,
					type: type,
					args: args
				};
				softwareArrays[dynamicContentType].push(softVar);
				$('select[data-dropdowncontent="' + dynamicContentType + '"]').append($('<option>').attr({
					'data-var-id': softVar.id,
					value: softVar.name
				}).html(softVar.name));
			}
		}
		//update type of all vars
		updateSoftVarTypes(softwareArrays, dynamicContentType, blocks, ioConnectors);
		// console.log('afterUpdating: ', softwareArrays);
	};

	var removeSoftVar = function(block) {
		var dynamicContentType = block.data.createDynamicContent;
		var found = false,
			i = 0;
		while (!found && (i < softwareArrays[dynamicContentType].length)) {
			if (softwareArrays[dynamicContentType][i].blockUid === block.uuid) {
				found = true;
			}
			i++;
		}
		if (found) {
			var softVar = softwareArrays[dynamicContentType][i - 1];
			softwareArrays[dynamicContentType].splice(i - 1, 1);
			$('option[data-var-id="' + softVar.id + '"]').remove();
		}
		updateSoftVarTypes(softwareArrays, dynamicContentType, blocks, ioConnectors);
	};

	var updateSoftVarTypes = function(softwareArrays, dynamicContentType, blocks, ioConnectors) {

		var tempSoftVar;
		for (var i = 0; i < softwareArrays[dynamicContentType].length; i++) {
			tempSoftVar = softwareArrays[dynamicContentType][i];
			tempSoftVar.type = utils.getTypeFromBlock(blocks[tempSoftVar.blockUid], blocks, ioConnectors, softwareArrays);
		}
		//utils.drawSoftwareArray(softwareArrays);
	};

	var removeBlock = function(blockUid, redraw) {
		//console.log('remove:', blockUid);
		var block = blocks[blockUid],
			i;
		if (block) {
			//disconnect
			var topConnector, bottomConnector, outputConnector;
			window.dispatchEvent(new Event('blocks:blockremoved'));
			block.dom[0].removeEventListener('mousedown', blockMouseDown);
			//if its moving remove all listener
			if ((mouseDownBlock && mouseDownBlock.getAttribute('data-block-id') === blockUid) ||
				(draggingBlock && draggingBlock.uuid)) {

				document.removeEventListener('mouseup', blockMouseUpBeforeMove);
				document.removeEventListener('mousemove', blockPreMouseMove);
				document.removeEventListener('mousemove', blockMouseMove);
				document.removeEventListener('mouseup', blockMouseUp);
			}
			switch (block.data.type) {
				case 'statement-input':
				case 'group':
					var tempBlock,
						childConnector = connectors[block.connectors[2]].connectedTo;

					while (childConnector) {
						tempBlock = utils.getBlockByConnector(childConnector, blocks, connectors);
						childConnector = connectors[tempBlock.connectors[1]].connectedTo;
						removeBlock(tempBlock.uuid);
					}
					/* falls through */
				case 'statement':

					topConnector = connectors[block.connectors[0]].connectedTo;
					bottomConnector = connectors[block.connectors[1]].connectedTo;

					if (topConnector && bottomConnector) {
						connectors[topConnector].connectedTo = bottomConnector;
						connectors[bottomConnector].connectedTo = topConnector;

						if (redraw) {
							utils.redrawTree(utils.getBlockByConnector(topConnector, blocks, connectors), blocks, connectors);
						}

					} else if (topConnector) {
						connectors[topConnector].connectedTo = null;
						var previousBlock = blocks[connectors[topConnector].blockUid];
						if (previousBlock.data.type === 'group') {
							previousBlock.dom.removeClass('with--content');
						}

						if (redraw) {
							utils.redrawTree(utils.getBlockByConnector(topConnector, blocks, connectors), blocks, connectors);
						}
					} else if (bottomConnector) {
						connectors[bottomConnector].connectedTo = null;
					}
					//remove the inputs blocks inside in 1 level
					var uuid;
					for (i = 0; i < block.ioConnectors.length; i++) {
						uuid = block.ioConnectors[i];
						if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
							removeBlock(ioConnectors[ioConnectors[uuid].connectedTo].blockUid);
						}
					}
					break;
				case 'output':
					outputConnector = ioConnectors[block.ioConnectors[0]].connectedTo;

					if (outputConnector) {
						ioConnectors[outputConnector].connectedTo = null;
					}
					break;
				default:
					throw 'we dont know how to delete: ' + block.data.type;
			}

			//remove visual
			block.dom.remove();
			//removeLogical
			var key;
			for (i = 0; i < block.connectors.length; i++) {
				delete connectors[block.connectors[i]];
			}
			for (i = 0; i < block.ioConnectors.length; i++) {
				delete ioConnectors[block.ioConnectors[i]];
			}

			//si es un block que genera dinmayc content
			if (block.data.createDynamicContent) {
				removeSoftVar(block);
			} else {
				for (key in softwareArrays) {
					updateSoftVarTypes(softwareArrays, key, blocks, ioConnectors);
				}
			}

			//remove the block
			delete blocks[blockUid];

		} else {
			throw 'Cant delete this block: ' + blockUid;
		}

	};

	var buildContent = function(block) {

		var componentsArray = block.componentsArray,
			blockData = block.data;
		var $tempElement;
		for (var j = 0; j < blockData.content.length; j++) {
			for (var k = 0; k < blockData.content[j].length; k++) {
				$tempElement = createBlockElement(block, blockData.content[j][k], componentsArray, softwareArrays);
				if (blockData.content[j][k].position === 'DOWN') {
					block.$contentContainerDown.addClass('with-content');
					block.$contentContainerDown.append($tempElement);
				} else {
					block.$contentContainer.append($tempElement);
				}
			}
		}
	};

	var buildStatementConnector = function(tempUid, blockConnectors, block, tempConnector, $container) {
		var $connector = $('<div>').attr({
			'data-connector-id': tempUid
		});

		$connector.addClass('connector connector-offline ' + blockConnectors.type);

		$container.append($connector);

		connectors[tempUid] = tempConnector;

		block.connectors.push(tempUid);
		return $connector;
	};

	var buildConnectors = function(blockConnectors, block) {
		//connectors
		var $connector, tempUid, tempConnector, $container;
		for (var i = 0; i < blockConnectors.length; i++) {

			tempUid = 'connector:' + utils.generateUUID();

			tempConnector = {
				uuid: tempUid,
				data: blockConnectors[i],
				blockUid: block.uuid,
				connectedTo: null
			};

			switch (blockConnectors[i].type) {
				case 'connector-top':
					if (block.data.type === 'statement-input') {
						$container = block.dom.children('.block--statement-input__header');
					} else {
						$container = block.dom.children('.block--fixed');
					}
					$connector = buildStatementConnector(tempUid, blockConnectors[i], block, tempConnector, $container);
					break;
				case 'connector-bottom':
					if (block.data.type === 'statement-input') {
						$container = block.dom.find('.block--extension--end');
					} else {
						$container = block.dom.children('.block--fixed');
					}
					$connector = buildStatementConnector(tempUid, blockConnectors[i], block, tempConnector, $container);
					break;
				case 'connector-root':
					if (block.data.type === 'statement-input') {
						$container = block.dom.children('.block--statement-input__header');
					} else {
						$container = block.dom;
					}
					$connector = buildStatementConnector(tempUid, blockConnectors[i], block, tempConnector, $container);

					break;
				case 'connector-input':
					$connector = $(block.dom.find('.blockinput[data-connector-name="' + blockConnectors[i].name + '"]'));

					$connector.attr({
						'data-connector-id': tempUid
					}).addClass('connector ' + blockConnectors[i].type);
					tempConnector.contentId = $connector.attr('data-content-id');
					ioConnectors[tempUid] = tempConnector;
					block.ioConnectors.push(tempUid);
					break;
				case 'connector-output':
					$connector = $('<div>').attr({
						'data-connector-id': tempUid
					}).addClass('connector connector-offline ' + blockConnectors[i].type);

					block.dom.append($connector);

					tempConnector.returnType = block.data.returnType;
					ioConnectors[tempUid] = tempConnector;

					block.ioConnectors.push(tempUid);
					break;
				case 'connector-empty':
					$connector = $('<div>');
					connectors[tempUid] = tempConnector;

					block.connectors.push(tempUid);
					break;
				default:
					throw 'Connector not defined to build';
			}
			tempConnector.jqueryObject = $connector;
		}
	};

	var createBlockElement = function(block, elementSchema, componentsArray, softwareArrays) {
		var i,
			$tempElement,
			$element = null,
			arrayOptions,
			key;
		switch (elementSchema.type) {
			case 'staticDropdown':
				//component
				$element = $('<select>');
				$element.attr({
					name: '',
					'data-content-id': elementSchema.id
				});

				var childs = [];
				for (i = 0; i < elementSchema.options.length; i++) {
					$tempElement = $('<option>').attr({
						value: elementSchema.options[i].value,
						'data-i18n': elementSchema.options[i].label
					}).html(translateBlock(lang, elementSchema.options[i].label));
					childs.push($tempElement);
				}
				utils.appendArrayInOneTime($element, childs);
				if (elementSchema.value) {
					$element.val(elementSchema.value);
				}

				$element.change(function() {
					window.dispatchEvent(new Event('blocks:change'));
				});

				if (block.data.returnType && block.data.returnType.type === 'fromDropdown') {
					$element.change(function() {
						updateSoftVar(block);
					});
				}

				break;
			case 'dynamicDropdown':
				$element = $('<select>');
				$element.attr({
					name: '',
					'data-content-id': elementSchema.id,
					'data-dropdowncontent': elementSchema.options,
					'data-value': elementSchema.value
				});

				switch (elementSchema.options) {
					case 'voidFunctions':
					case 'returnFunctions':
					case 'softwareVars':
					case 'classes':
					case 'objects':
						arrayOptions = softwareArrays[elementSchema.options];
						$element.change(function() {
							//if we change a dynamicDropdown, can be for two reasons
							// We are a output and we refresh vars of the old BLoq
							// We are selecting a variable in a statement, and we update the dont change type
							if (block.data.type === 'output') {
								var outputConnector = utils.getOutputConnector(block, ioConnectors);
								//if its connected to another block, we update the vars of the old block
								if (outputConnector.connectedTo) {

									var blockConnector = ioConnectors[outputConnector.connectedTo],
										oldBlock = blocks[blockConnector.blockUid];

									if (oldBlock.data.returnType && (oldBlock.data.returnType.type === 'fromInput')) {
										updateSoftVar(oldBlock);
									}
								}
							}
						});
						break;
					case 'varComponents':
						arrayOptions = [];

						for (key in componentsArray) {
							if (componentsArray[key].length >= 1) {
								arrayOptions = arrayOptions.concat(componentsArray[key]);
							}
						}
						break;
					case 'clocks':
						arrayOptions = [];
						arrayOptions = componentsArray.clocks;
						break;
					case 'hts221':
						arrayOptions = [];
						arrayOptions = componentsArray.hts221;
						break;
					default:
						arrayOptions = componentsArray[elementSchema.options];
				}
				if (!arrayOptions) {
					throw 'Dropdowns not defined in array: ' + elementSchema.options;
				}

				//content
				utils.drawDropdownOptions($element, arrayOptions);

				if (elementSchema.value) {
					$element.val(elementSchema.value);
					var componentRef = arrayOptions.find(function(item) {
						return item.name === elementSchema.value;
					});
					$element[0].dataset.reference = componentRef ? componentRef.uid : '';
					$element[0].dataset.value = elementSchema.value;
					$element.val(elementSchema.value);
				}

				$element.change(function(evt) {
					$element[0].dataset.value = evt.currentTarget.value;
					$element[0].dataset.reference = evt.currentTarget.selectedOptions[0].dataset.reference;
					//$element[0].dataset.varreference = evt.currentTarget.selectedOptions[0].dataset.varId;
					window.dispatchEvent(new Event('blocks:change'));
				});

				break;
			case 'text':
				$element = $('<span>').attr({
					'data-i18n': elementSchema.value
				}).html(translateBlock(lang, elementSchema.value));
				break;
			case 'removableText':
				$element = $('<span>').html(elementSchema.value);
				$element.addClass('removabletext');

				break;
			case 'numberInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				//Check that the characters are numbers
				$element.bind('input', function() {
					var position = utils.getCaretPosition(this);
					var a = utils.validNumber($(this).val());
					$(this).val(a.value);
					utils.setCaretPosition(this, position - a.removedChar);
				});
				$element.change(function() {
					//console.log('change number!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'stringInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.type,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					$element.val(utils.validString($element.val()));
					//console.log('change String!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'charInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.type,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					$element.val(utils.validChar($element.val()));
					//console.log('change Char!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'codeInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.type,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					//console.log('change SCinput!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'multilineCodeInput':
				$element = $('<textarea class="msd-elastic: \n;" spellcheck="false" ng-model="bar" cols="40" rows="1"></textarea>').attr({
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.type,
					'name': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				setTimeout(function() {
					$('[name="' + elementSchema.id + '"]').autogrow({
						onInitialize: true
					});
				}, 0);
				$element.change(function() {
					//console.log('change multilineCode!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'multilineCommentInput':
				$element = $('<textarea class="msd-elastic: \n;" spellcheck="false" ng-model="bar" cols="40" rows="1"></textarea>').attr({
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.type,
					'name': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				setTimeout(function() {
					$('[name="' + elementSchema.id + '"]').autogrow({
						onInitialize: true
					});
				}, 0);

				$element.keyup(function() {
					blocksUtils.delay(function() {
						$element.val(utils.validComment($element.val()));
					}, 1000);
				});

				$element.change(function() {
					$element.val(utils.validComment($element.val()));
					//console.log('change multilineComment!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'varInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBlock(lang, elementSchema.placeholder)
				}).val(elementSchema.value);

				block.varInputs = [];
				block.varInputs.push($element);
				$element.addClass('var--input');
				//Transform the name to create valid function / variables names
				$element.keyup(function() {
					blocksUtils.delay(function() {
						var name = utils.validName($element.val(), softwareArrays);
						$element.val(name);
						if (name) {
							updateSoftVar(block, name);
						} else {
							removeSoftVar(block, name);
						}
					}, 1000);
				});

				$element.change(function() {
					//console.log('change varInput!');
					window.dispatchEvent(new Event('blocks:change'));
				});
				break;
			case 'blockInput':
				$element = $('<div>').attr({
					'data-connector-name': elementSchema.name,
					'data-content-id': elementSchema.blockInputId
				});
				$element.addClass('blockinput');
				break;
			case 'headerText':
				$element = $('<h3>').html(elementSchema.value);
				$element.addClass('headerText');
				break;
			case 'descriptionText':
				$element = $('<p>').html(elementSchema.value);
				$element.addClass('descriptionText');
				break;
			default:
				throw 'elementSchema not defined: ' + elementSchema.type;
		}

		return $element;
	};

	var destroyFreeBlocks = function() {
		var uuid, block;
		for (uuid in blocks) {
			block = blocks[uuid];
			if (block.isConnectable()) {
				switch (block.data.type) {
					case 'statement':
					case 'statement-input':
						if (!connectors[block.connectors[0]].connectedTo) {
							removeBlock(uuid);
						}
						break;
					case 'output':
						if (!ioConnectors[block.ioConnectors[0]].connectedTo) {
							removeBlock(uuid);
						}
						break;
					case 'group':
						break;
					default:
						throw 'its free? ' + block.data.type;
				}
			}
		}
	};

	/**
	 * Get blocks that are not connected
	 *
	 */
	var getFreeBlocks = function() {
		var block,
			result = [],
			blockGroup,
			tempBlock,
			connectedConnector;
		for (var uuid in blocks) {
			block = blocks[uuid];
			if (block.isConnectable()) {
				switch (block.data.type) {
					case 'statement':
					case 'statement-input':
						if (!connectors[block.connectors[0]].connectedTo) {
							blockGroup = [block.getBlocksStructure()];
							connectedConnector = connectors[block.connectors[1]].connectedTo;
							while (connectedConnector) {
								tempBlock = utils.getBlockByConnector(connectedConnector, blocks, connectors);
								blockGroup.push(tempBlock.getBlocksStructure());
								connectedConnector = connectors[tempBlock.connectors[1]].connectedTo;
							}
							result.push({
								position: block.dom.position(),
								blockGroup: blockGroup
							});
						}
						break;
					case 'output':
						if (!ioConnectors[block.ioConnectors[0]].connectedTo) {
							blockGroup = [block.getBlocksStructure()];
							result.push({
								position: block.dom[0].getBoundingClientRect(),
								blockGroup: blockGroup
							});
						}
						break;
					case 'group':
						break;
					default:
						throw 'its free? ' + block.data.type;
				}
			}
		}
		return result;
	};

	var updateDropdowns = function() {
		var key;
		for (key in softwareArrays) {
			updateDropdown(key);
		}
	};

	var updateDropdown = function(softwareArrayKey) {
		var $element, tempValue;
		$('select[data-dropdownContent="' + softwareArrayKey + '"]').each(function(index, element) {
			$element = $(element);
			tempValue = $element.attr('data-value');
			blocksUtils.drawDropdownOptions($element, softwareArrays[softwareArrayKey]);
			if (tempValue) {
				$element.val(tempValue);
			}
		});
	};

	var translateBlock = function(lang, key) {
		return common.blocksLanguages[lang][key] || key;
	};

	// Block Constructor
	var Block = function Block(params) {
		this.uuid = 'block:' + utils.generateUUID();

		$field = params.$field || $field;

		this.data = params.data;
		this.componentsArray = params.componentsArray;
		this.connectors = [];
		this.ioConnectors = [];

		var enable = false,
			connectable,
			that = this;

		this.collapseGroupContent = function() {

			var $fieldContent = that.dom.children('.field--content');
			//$fieldContent = $(e.currentTarget).parent().find('.field--content');
			$fieldContent.toggleClass('field--collapsed');
			that.connectable = !that.connectable;
			$fieldContent.parent().toggleClass('collapsed--field');
		};

		this.enable = function(onlyParent) {
			if (!enable) {
				this.dom.removeClass('disabled');
				//console.log('activamos', this.uuid, this.data.name);
				if (this.data.content && this.data.content[0]) {
					for (var i = 0; i < this.data.content[0].length; i++) {
						if (this.data.content[0][i].type === 'blockInput') {
							var uuid;
							for (var j = 0; j < this.ioConnectors.length; j++) {
								uuid = this.ioConnectors[j];
								if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
									utils.getBlockByConnector(ioConnectors[uuid].connectedTo, blocks, ioConnectors).enable();
								}
							}
						}
					}
				}

				enable = true;

				if (this.connectors[2] && !onlyParent) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBlock;
					while (connector) {
						tempBlock = utils.getBlockByConnector(connector, blocks, connectors);
						tempBlock.enable();
						connector = connectors[tempBlock.connectors[1]].connectedTo;
					}
				}
			}
		};

		this.disable = function(onlyParent) {
			this.dom.addClass('disabled');
			if (enable) {

				//console.log('activamos', this.uuid, this.data.name);
				if (this.data.content && this.data.content[0]) {
					for (var i = 0; i < this.data.content[0].length; i++) {
						switch (this.data.content[0][i].type) {
							case 'blockInput':
								//disable the inputs blocks inside in 1 level
								var uuid;
								for (var j = 0; j < this.ioConnectors.length; j++) {
									uuid = this.ioConnectors[j];
									if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
										utils.getBlockByConnector(ioConnectors[uuid].connectedTo, blocks, ioConnectors).disable();
									}
								}
								break;
							default:
						}
					}
				}

				enable = false;

				if (this.connectors[2] && !onlyParent) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBlock;
					while (connector) {
						tempBlock = utils.getBlockByConnector(connector, blocks, connectors);
						tempBlock.disable();
						connector = connectors[tempBlock.connectors[1]].connectedTo;
					}
				}
			}
		};

		this.itsEnabled = function() {
			return enable;
		};

		this.doConnectable = function() {
			if (!connectable) {
				// console.log('make them connectable', this.uuid, this.data.name);
				if (this.data.content && this.data.content[0]) {
					for (var i = 0; i < this.data.content[0].length; i++) {
						if (this.data.content[0][i].type === 'blockInput') {
							var uuid;
							for (var j = 0; j < this.ioConnectors.length; j++) {
								uuid = this.ioConnectors[j];
								if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
									utils.getBlockByConnector(ioConnectors[uuid].connectedTo, blocks, ioConnectors).doConnectable();
								}
							}
						}
					}
				}
				if (this.connectors[2]) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBlock;
					while (connector) {
						tempBlock = utils.getBlockByConnector(connector, blocks, connectors);
						tempBlock.doConnectable();
						connector = connectors[tempBlock.connectors[1]].connectedTo;
					}
				}
				connectable = true;
				this.dom[0].dispatchEvent(new Event('block:connectable'));
			}
		};

		this.doNotConnectable = function() {
			connectable = false;
		};

		this.isConnectable = function() {
			return connectable;
		};

		this.itsFree = function() {
			return (this.dom.closest('.block--group').length === 0);
		};

		//creation
		this.dom = $('<div>').attr({
			'data-block-id': this.uuid,
			tabIndex: 0
		});

		this.dom.addClass('block block--' + this.data.type + ' ' + this.data.blockClass);

		blocks[this.uuid] = this;

		//this.disable();
		this.doNotConnectable();

		switch (this.data.type) {
			case 'statement-input':
				this.dom.append('<div class="block--statement-input__header"></div><div class="block--extension"><div class="block--extension__content"></div> <div class="block--extension--end"></div></div>');
				this.$contentContainer = this.dom.find('.block--statement-input__header');
				this.$contentContainerDown = this.dom.find('.block--extension--end');
				//this.dom.attr('draggable', true);
				buildContent(this);
				this.dom[0].addEventListener('mousedown', blockMouseDown);
				buildConnectors(params.data.connectors, this);
				this.$contentContainer.children().children().not('.connector.connector-offline').first().addClass('block__inner--first');
				this.$contentContainer.children().children().not('.connector.connector-offline').last().addClass('block__inner--last');
				this.$contentContainer.children().not('.connector.connector-offline').last().addClass('block__inner--last');
				this.$contentContainerDown.children().not('.connector.connector-offline').first().addClass('block__inner--first');
				this.$contentContainerDown.children().not('.connector.connector-offline').last().addClass('block__inner--last');
				break;
			case 'statement':
				this.dom.append('<div class="block--fixed">');
				this.$contentContainer = this.dom.find('.block--fixed');
				//this.dom.attr('draggable', true);
				buildContent(this);
				this.dom[0].addEventListener('mousedown', blockMouseDown);
				buildConnectors(params.data.connectors, this);
				this.dom.children().children().not('.connector.connector-offline').first().addClass('block__inner--first');
				this.dom.children().children().not('.connector.connector-offline').last().addClass('block__inner--last');
				break;
			case 'output':
				this.$contentContainer = this.dom;
				//this.dom.attr('draggable', true);
				buildContent(this);
				this.dom[0].addEventListener('mousedown', blockMouseDown);
				buildConnectors(params.data.connectors, this);
				this.dom.children().not('.connector.connector-offline').first().addClass('block__inner--first');
				this.dom.children().not('.connector.connector-offline').last().addClass('block__inner--last');
				break;
			case 'group':
				this.dom.append('<div class="field--header"><button class="btn btn--collapsefield"></button><h3 data-i18n="' + this.data.headerText + '">' + translateBlock(lang, this.data.headerText) + '</h3></div><div class="field--content"><p data-i18n="' + this.data.descriptionText + '">' + translateBlock(lang, this.data.descriptionText) + '</p><div class="block--extension--info" data-i18n="drag-block" > ' + translateBlock(lang, 'drag-block') + '</div><div class="block--extension__content"></div></div>');

				buildConnectors(params.data.connectors, this);
				this.dom.find('.connector-root').addClass('connector-root--group');
				this.dom.find('.field--header .btn').on('click', this.collapseGroupContent);
				this.dom.find('.field--header h3').on('click', this.collapseGroupContent);
				break;
			default:
				throw 'blockData ' + this.data.type + 'not defined in block construction';
		}

		if (this.data.createDynamicContent) {
			var name = utils.validName(this.dom.find('input.var--input').val());
			if (name) {
				updateSoftVar(this, name);
			} else {
				removeSoftVar(this, name);
			}
		}

		this.getioConnectorUidByContentId = function(contentId) {
			var found = false,
				i = 0,
				result = null;

			while (!found && (i < this.ioConnectors.length)) {
				if (ioConnectors[this.ioConnectors[i]].contentId === contentId) {
					found = true;
					result = this.ioConnectors[i];
				}
				i++;
			}
			return result;
		};

		this.getCode = function(previousCode) {
			var code = this.data.code;
			var childBlock, childConnectorId;
			var elementTags = _.without(_.pluck(this.data.content[0], 'id'), undefined);
			var childrenTags = _.without(_.pluck(this.data.content[0], 'blockInputId'), undefined);
			var value = '',
				type = '';
			var connectionType = '';

			elementTags.forEach(function(elem) {
				var element = this.$contentContainer.find('> [data-content-id="' + elem + '"]');
				if (element.length === 0) {
					element = this.$contentContainer.find('[data-content-id="' + elem + '"]');
				}
				value = element.val() || '';
				//hardcoded!!
				for (var j = 0; j < this.componentsArray.sensors.length; j++) {
					if (value === this.componentsArray.sensors[j].name) {
						type = this.componentsArray.sensors[j].type;
						if (type === 'analog') {
							value = 'analogRead(' + this.componentsArray.sensors[j].pin.s + ')';
						} else if (type === 'digital') {
							value = 'digitalRead(' + this.componentsArray.sensors[j].pin.s + ')';
						} else if (type === 'LineFollower') { // patch. When the new Web2Board is launched with float * as return, remove this
							value = '(float *)' + this.componentsArray.sensors[j].name + '.read()';
						} else {
							value = this.componentsArray.sensors[j].name + '.read()';
						}
						code = code.replace(new RegExp('{' + elem + '.type}', 'g'), value);
					}

				}
				if (element.attr('data-content-type') === 'stringInput') {
					value = utils.validString(value);
				} else if (element.attr('data-content-type') === 'charInput') {
					value = utils.validChar(value);
				} else if (element.attr('data-content-type') === 'multilineCommentInput') {
					value = utils.validComment(value);
				}
				var valueWithoutAsterisk = value.replace(' *', '');
				code = code.replace(new RegExp('{' + elem + '}.withoutAsterisk', 'g'), valueWithoutAsterisk);
				code = code.replace(new RegExp('{' + elem + '}', 'g'), value);
			}.bind(this));

			var blockInputConnectors = utils.getInputsConnectorsFromBlock(ioConnectors, blocks, this);
			if (childrenTags.length > 0) {
				// search for child blocks:
				for (var k = 0; k < blockInputConnectors.length; k++) {

					value = '';
					connectionType = '';
					type = '';
					var a = ioConnectors[blockInputConnectors[k]];
					if (a) {
						childConnectorId = a.connectedTo;
						if (childConnectorId !== null) {
							childBlock = utils.getBlockByConnector(childConnectorId, blocks, ioConnectors);
							value = childBlock.getCode();
							type = childBlock.data.returnType;
						}
						if (type.type === 'fromDynamicDropdown') {
							connectionType = utils.getFromDynamicDropdownType(childBlock || this, type.idDropdown, type.options, softwareArrays, this.componentsArray);
						} else if (type.type === 'fromDropdown') {
							connectionType = utils.getTypeFromBlock(childBlock || this, blocks, ioConnectors, softwareArrays);
						} else {
							connectionType = type.value;
							if (connectionType === 'string') {
								connectionType = 'String';
							}
						}
					}
					if (connectionType === undefined) {
						connectionType = '';
					}
					code = code.replace(new RegExp('{' + childrenTags[k] + '.connectionType}', 'g'), connectionType);
					code = code.replace(new RegExp('{' + childrenTags[k] + '}', 'g'), value);

				}
			}
			//search for regular expressions:
			var reg = /(.*)\?(.*):(.*)/g;
			if (reg.test(code)) {
				code = eval(code); // jshint ignore:line
			}
			var children = [];
			if (this.connectors[2]) {
				value = '';
				childConnectorId = connectors[this.connectors[2]].connectedTo;
				if (childConnectorId) {
					childBlock = utils.getBlockByConnector(childConnectorId, blocks, connectors);
					var branchConnectors = utils.getBranchsConnectorsNoChildren(childBlock.uuid, connectors, blocks);

					branchConnectors.forEach(function(branchConnector) {
						if (utils.isInsideConnectorRoot(blocks[connectors[branchConnector].blockUid], blocks, connectors)) {
							var blockId = connectors[branchConnector].blockUid;
							if (blockId !== children[children.length - 1]) {
								children.push(blockId);
							}
						}
					});
				}
				children.forEach(function(elem) {
					value += blocks[elem].getCode();
				});
				// if (children.length >= 1) {
				//     for (i in children) {
				//         value += blocks[children[i]].getCode();
				//     }
				// }
				code = code.replace(new RegExp('{STATEMENTS}', 'g'), value);
			}
			if (code.indexOf('{CLASS-OUTSIDE}') >= 0) {
				var rootParentName = utils.getClassName(this, blocks, connectors);
				if (rootParentName) {
					code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), rootParentName);
				}
				code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), '');
			}
			if (previousCode === undefined) {
				previousCode = '';
			} else { //the previousCode is always (from now) inserted after the void setup(){ string
				code = blocksUtils.splice(code, code.indexOf('{') + 1, 0, previousCode);
			}
			if (!this.itsEnabled()) {
				//TODO: search highest parent disabled and add the comment characters
				// code = '/*' + code + '*/';
				code = '';
			}
			return code;
		};

		this.getBlocksStructure = function(fullStructure) {
			var result,
				tempBlock;

			if (fullStructure) {
				result = _.cloneDeep(this.data);
			} else {
				result = {
					name: this.data.name,
					content: [
						[]
					]
				};
			}
			result.enable = this.itsEnabled();

			var rootConnector = this.connectors[2];
			if (rootConnector) {
				result.childs = [];
				var connectedConnector = connectors[rootConnector].connectedTo;
				while (connectedConnector) {
					tempBlock = utils.getBlockByConnector(connectedConnector, blocks, connectors);
					result.childs.push(tempBlock.getBlocksStructure(fullStructure));
					connectedConnector = connectors[tempBlock.connectors[1]].connectedTo;
				}
			}

			var tempObject, value, selectedValue, attributeValue;
			if (this.data.content[0]) {

				for (var i = 0; i < this.data.content[0].length; i++) {
					tempObject = null;
					switch (this.data.content[0][i].type) {
						case 'varInput':
						case 'stringInput':
						case 'numberInput':
						case 'multilineCodeInput':
						case 'multilineCommentInput':
						case 'codeInput':
						case 'charInput':
							value = this.dom.find('[data-content-id="' + this.data.content[0][i].id + '"]').val();
							if (value) {
								tempObject = {
									alias: this.data.content[0][i].type,
									id: this.data.content[0][i].id,
									value: value
								};
							}
							break;
						case 'blockInput':
							//get the inputs blocks inside in 1 level
							var uuid,
								connectedBlock;
							uuid = this.getioConnectorUidByContentId(this.data.content[0][i].blockInputId);
							if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
								connectedBlock = utils.getBlockByConnector(ioConnectors[uuid].connectedTo, blocks, ioConnectors);
								tempObject = {
									alias: this.data.content[0][i].type,
									blockInputId: this.data.content[0][i].blockInputId,
									value: connectedBlock.getBlocksStructure(fullStructure)
								};
							}

							break;
						case 'dynamicDropdown':
							attributeValue = this.dom.find('select[data-content-id="' + this.data.content[0][i].id + '"][data-dropdowncontent="' + this.data.content[0][i].options + '"]').attr('data-value');
							selectedValue = this.dom.find('select[data-content-id="' + this.data.content[0][i].id + '"][data-dropdowncontent="' + this.data.content[0][i].options + '"]').val();
							//only software Vars get value from val(), hardware, use attribute or val()
							var variableType = this.data.content[0][i].options;
							var itsSoftwareValue = Object.keys(softwareArrays).indexOf(variableType);

							if (itsSoftwareValue !== -1) {
								value = selectedValue;
							} else {
								value = attributeValue || selectedValue;
							}

							// console.log('val', attributeValue, selectedValue);
							if (value) {
								tempObject = {
									alias: this.data.content[0][i].type,
									id: this.data.content[0][i].id,
									value: value
								};
							}
							break;
						case 'staticDropdown':
							//value = this.dom.find('select[data-content-id="' + this.data.content[0][i].id + '"]').val();
							value = this.$contentContainer.find('> select[data-content-id="' + this.data.content[0][i].id + '"]').val();
							if (value) {
								tempObject = {
									alias: this.data.content[0][i].type,
									id: this.data.content[0][i].id,
									value: value
								};
							}
							break;
						case 'text':
							//we dont catch this field
							break;
						default:
							throw 'I dont know how to get the structure from this contentType :( ' + this.data.content[0][i].type;
					}
					if (tempObject) {
						if (fullStructure) {
							result.content[0][i].value = tempObject.value;
						} else {
							result.content[0].push(tempObject);
						}
					}

				}
			}

			return result;
		};

		return this;
	};


	var buildBlockWithContent = function(data, componentsArray, schemas, $field) {

		var tempBlock,
			originalBlockSchema = schemas[data.name],
			blockSchema,
			lastBottomConnector,
			tempNodeBlock,
			tempOutputBlock,
			inputConnectorUid,
			$dropContainer,
			i;


		if (!originalBlockSchema) {
			console.error('no original schema', data);
		}
		//fill the schema with content
		blockSchema = blocksUtils.fillSchemaWithContent(originalBlockSchema, data);
		tempBlock = new Block({
			blockData: blockSchema,
			componentsArray: componentsArray,
			$field: $field
		});

		if (data.content) {
			for (i = 0; i < data.content[0].length; i++) {
				if (data.content[0][i].type === 'blockInput') {
					inputConnectorUid = tempBlock.getioConnectorUidByContentId(data.content[0][i].blockInputId);
					$dropContainer = tempBlock.dom.find('[data-connector-id="' + inputConnectorUid + '"]').first();
					//console.debug($dropContainer);
					//inputConnectorUid = $dropContainer.attr('data-connector-id');
					//console.debug(inputConnectorUid);
					tempOutputBlock = buildBlockWithContent(data.content[0][i].value, componentsArray, schemas, $field);
					tempOutputBlock.dom.addClass('nested-block');
					//Connections in blockInput
					//logical
					if (!ioConnectors[inputConnectorUid]) {
						console.debug('not connector?', originalBlockSchema);
					}
					ioConnectors[inputConnectorUid].connectedTo = tempOutputBlock.ioConnectors[0];
					ioConnectors[tempOutputBlock.ioConnectors[0]].connectedTo = inputConnectorUid;
					//visual
					//$dropContainer[0].appendChild(tempOutputBlock.dom[0])
					$dropContainer.append(tempOutputBlock.dom);
				}
			}
		}

		if (data.childs) {

			$dropContainer = tempBlock.dom.find('.block--extension__content');
			lastBottomConnector = tempBlock.connectors[2];

			if (data.childs.length > 0) {
				tempBlock.dom.addClass('with--content');
			}
			for (i = 0; i < data.childs.length; i++) {
				tempNodeBlock = buildBlockWithContent(data.childs[i], componentsArray, schemas, $field);
				//Connections in statement
				//logical
				connectors[lastBottomConnector].connectedTo = tempNodeBlock.connectors[0];
				connectors[tempNodeBlock.connectors[0]].connectedTo = lastBottomConnector;
				lastBottomConnector = tempNodeBlock.connectors[1];

				//visual
				tempNodeBlock.dom.addClass('inside-block');
				$dropContainer.append(tempNodeBlock.dom);
			}
		}

		if (data.enable) {
			tempBlock.enable(true);
		} else {

			tempBlock.disable();
		}
		if (tempBlock.data.createDynamicContent) {
			updateSoftVar(tempBlock);
		}

		return tempBlock;
	};

	var exports = {};
	exports.Block = Block;
	exports.updateSoftVar = updateSoftVar;
	exports.connectors = connectors;
	exports.ioConnectors = ioConnectors;
	exports.blocks = blocks;
	exports.removeBlock = removeBlock;

	exports.getFreeBlocks = getFreeBlocks;
	exports.destroyFreeBlocks = destroyFreeBlocks;
	exports.updateDropdowns = updateDropdowns;
	exports.setOptions = setOptions;
	exports.buildBlockWithContent = buildBlockWithContent;

	return exports;
});
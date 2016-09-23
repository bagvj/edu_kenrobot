define(function() {
	var blocks = {};
	var connectors = {};
	var ioConnectors = {};
	var activeConnectors = [];
	var activeIOConnectors = [];

	var mouseDownBlockDom;
	var dragBlock;
	var container;
	var containerOffsetX;
	var connectorOffsetY;

	var startPreMouseMove;
	var preMouseMoveX;
	var preMouseMoveY;
	var dragBlockPreX;
	var dragBlockPreY;
	var dragMouseX;
	var dragMouseY;

	var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
	var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
	reservedWords = reservedWords.split(',');

	function Block(blockData) {
		this.data = blockData;
		this.uid = genUid();
		this.connectable = false;
		this.enable = true;
		this.free = false;
		this.connectors = [];
		this.ioConnectors = [];

		var dom = document.createElement('div');
		dom.draggable = false;
		dom.dataset.uid = this.uid;
		dom.classList.add("block");
		dom.classList.add("block-" + this.data.type);
		this.data.tags && this.data.tags.forEach(function(tag) {
			dom.classList.add(tag);
		});
		this.dom = dom;

		switch (this.data.type) {
			case "statement-input":
				this.dom.innerHTML = '<div class="statement-header"></div><div class="statement-extension"><div class="statement-extension-content"></div><div class="statement-extension-end"></div></div>';
				this.contentDom = this.dom.querySelector(".statement-header");

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener('mousedown', onBlockMouseDown);
				break;
			case "statement":
				this.dom.innerHTML = '<div class="statement-content"></div>';
				this.contentDom = this.dom.querySelector(".statement-content");

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener('mousedown', onBlockMouseDown);
				break;
			case "output":
				this.contentDom = this.dom;

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener('mousedown', onBlockMouseDown);
				break;
			case "group":
				this.dom.innerHTML = '<div class="group-content"></div>';
				buildConnectors(this);
				this.connectable = true;
				break;
		}

		blocks[this.uid] = this;
	}

	Block.prototype.getCode = function() {
		return getBlockCode(this);
	}

	Block.prototype.copy = function() {
		return copyBlock(this);
	}

	Block.prototype.remove = function() {
		removeBlock(this);
	}

	Block.prototype.getStructure = function() {
		return getBlockStructure(this);
	}

	Block.prototype.isEnable = function() {
		return this.enable;
	}

	Block.prototype.setEnable = function(value) {
		setBlockEnable(this, value, false);
	}

	Block.prototype.isConnectable = function() {
		return this.connectable;
	}

	Block.prototype.setConnectable = function(value) {
		setBlockConnectable(this, value);
	}

	Block.prototype.isFree = function() {
		return this.free;
	}

	function buildContent(block) {
		var extDom;
		block.data.content.forEach(function(elementData) {
			var elementDom = createBlockElement(block, elementData);
			if (elementData.extra && !extDom) {
				extDom = block.dom.querySelector(".statement-extension-end");
				extDom.classList.add("with-content");
			}
			elementData.extra ? extDom.appendChild(elementDom) : block.contentDom.appendChild(elementDom);
		});
	}

	function buildConnectors(block) {
		var connectorDom;
		var connectorUid;
		var connector;
		var containerDom;

		block.data.connectors.forEach(function(connectorData) {
			connectorUid = genUid();
			connector = {
				uid: connectorUid,
				data: connectorData,
				blockUid: block.uid,
				connectedTo: null
			};

			switch (connectorData.type) {
				case "connector-top":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-header") : block.dom.querySelector(".statement-content");
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-bottom":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-extension-end") : block.dom.querySelector(".statement-content");
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-root":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-header") : block.dom;
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-input":
					connectorDom = block.dom.querySelector('.block-input[data-connector-name="' + connectorData.name + '"]');
					connectorDom.dataset.connectorUid = connectorUid;
					connectorDom.classList.add("connector");
					connectorDom.classList.add(connectorData.type);

					connector.contentId = connectorDom.dataset.contentId;
					ioConnectors[connectorUid] = connector;
					block.ioConnectors.push(connectorUid);
					break;
				case "connector-output":
					connectorDom = document.createElement("div");
					connectorDom.dataset.connectorUid = connectorUid;
					connectorDom.classList.add("connector");
					connectorDom.classList.add(connectorData.type);
					block.dom.appendChild(connectorDom);

					connector.returnType = block.data.returnType;
					ioConnectors[connectorUid] = connector;
					block.ioConnectors.push(connectorUid);
					break;
				case "connector-empty":
					connectorDom = document.createElement("div");
					connectors[connectorUid] = connector;
					block.connectors.push(connectorUid);
					break;
			}
			connector.dom = connectorDom;
		});
	}

	function createBlockElement(block, elementData) {
		var elementDom;
		switch (elementData.type) {
			case "static-select":
				elementDom = document.createElement("div");
				elementDom.classList.add("select-wrap");
				var selectDom = document.createElement("select");
				elementDom.appendChild(selectDom);

				selectDom.dataset.contentId = elementData.id;
				elementData.options.forEach(function(optionData) {
					var optionDom = document.createElement("option");
					optionDom.value = optionData.value;
					optionDom.innerHTML = optionData.label;
					selectDom.appendChild(optionDom);
				});
				elementData.value && (selectDom.value = elementData.value);

				break;
			case "dynamic-select":
				elementDom = document.createElement("div");
				elementDom.classList.add("select-wrap");
				var selectDom = document.createElement("select");
				elementDom.appendChild(selectDom);

				selectDom.dataset.contentId = elementData.id;

				break;
			case "text":
				elementDom = document.createElement("span");
				elementDom.innerHTML = elementData.value;
				break;
			case "block-input":
				elementDom = document.createElement("div");
				elementDom.dataset.connectorName = elementData.name;
				elementDom.dataset.contentId = elementData.blockInputId;
				elementDom.classList.add("block-input");
				break;
			case "var-input":
				elementDom = createInputElement(elementData);
				break;
			case "number-input":
				elementDom = createInputElement(elementData);
				break;
			case "string-input":
				elementDom = createInputElement(elementData);
				elementDom.dataset.contentType = elementData.type;

				break;
			case "char-input":
				elementDom = createInputElement(elementData);
				elementDom.dataset.contentType = elementData.type;

				break;
			case "code-input":
				elementDom = createTextareaElement(elementData);

				break;
			case "comment-input":
				elementDom = createTextareaElement(elementData);

				break;
			default:
				elementDom = document.createElement("div");

				break;
		}

		return elementDom;
	}

	function createInputElement(elementData) {
		var inputDom = document.createElement("input");
		inputDom.type = "text";
		inputDom.value = elementData.value || "";
		inputDom.placeholder = elementData.placeholder || "";
		inputDom.dataset.contentId = elementData.id;

		return inputDom;
	}

	function createTextareaElement(elementData) {
		var textareaDom = document.createElement("textarea");
		textareaDom.name = elementData.id;
		textareaDom.spellcheck = false;
		textareaDom.cols = 40;
		textareaDom.rows = 1;
		textareaDom.value = elementData.value || "";
		textareaDom.placeholder = elementData.placeholder || "";
		textareaDom.dataset.contentId = elementData.id;
		textareaDom.dataset.contentType = elementData.type;

		return textareaDom;
	}

	function buildStatementConnector(block, connectorUid, connectorData, connector, containerDom) {
		var connectorDom = document.createElement("div");
		connectorDom.dataset.connectorUid = connectorUid;
		connectorDom.classList.add("connector");
		connectorDom.classList.add(connectorData.type);
		containerDom.appendChild(connectorDom);
		connectors[connectorUid] = connector;
		block.connectors.push(connectorUid);

		return connectorDom;
	}

	function onBlockMouseDown(e) {
		var tagName = e.target.tagName.toLowerCase();
		if (tagName == "select" || tagName == "input" || tagName == "textarea") {
			return;
		}

		e.stopPropagation();
		mouseDownBlockDom = e.currentTarget;
		startPreMouseMove = true;
		document.addEventListener('mouseup', onBlockMouseUpBeforeMove);
		document.addEventListener('mousemove', onBlockPreMouseMove);
	}

	function onBlockMouseUpBeforeMove(e) {
		mouseDownBlockDom = null;
		document.removeEventListener('mouseup', onBlockMouseUpBeforeMove);
		document.removeEventListener('mousemove', onBlockPreMouseMove);
	}

	function onBlockPreMouseMove(e) {
		if (startPreMouseMove) {
			startPreMouseMove = false;
			preMouseMoveX = e.pageX;
			preMouseMoveY = e.pageY;

			var rect = mouseDownBlockDom.getBoundingClientRect();
			var containerRect = container.getBoundingClientRect();

			dragBlockPreX = rect.left
			dragBlockPreY = rect.top;
			dragMouseX = e.pageX - rect.left + containerRect.left - container.scrollLeft;
			dragMouseY = e.pageY - rect.top + containerRect.top - container.scrollTop;
		} else {
			var distanceX = e.pageX - preMouseMoveX;
			var distanceY = e.pageY - preMouseMoveY;

			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener('mousemove', onBlockPreMouseMove);
				document.addEventListener('mousemove', onBlockMouseMove);
			}
		}
	}

	function onBlockMouseMove(e) {
		var block;
		if (mouseDownBlockDom) {
			document.removeEventListener('mouseup', onBlockMouseUpBeforeMove);
			document.addEventListener('mouseup', onBlockMouseUp);
			block = getBlock(mouseDownBlockDom.dataset.uid);

			if (!block.connectable) {
				block = createBlock(block.data);
				setBlockConnectable(block, true);

				container.appendChild(block.dom);
			}
			block.dom.classList.add("dragging");

			switch (block.data.type) {
				case "statement":
				case "statement-input":
					statementDragStart(block);
					break;
				case "output":
					outputDragStart(block);
					break;
			}

			dragBlock = block;
			mouseDownBlockDom = null;
		}

		block = block || dragBlock;
		var instance = moveBlock(block, e.clientX, e.clientY);
		switch (block.data.type) {
			case "statement":
			case "statement-input":
				redrawTree(block);
				instance > 10 && handleCollision([block.connectors[0], getLastBottomConnectorUid(block.uid)]);
				break;
			case "output":
				instance > 10 && handleIOCollision(block);
				break;
		}
	}

	function onBlockMouseUp(e) {
		document.removeEventListener('mousemove', onBlockMouseMove);
		document.removeEventListener('mouseup', onBlockMouseUp);

		var block = dragBlock;
		var dropConnectorDom = container.querySelector(".connector.active");
		if (dropConnectorDom) {
			switch (block.data.type) {
				case "statement":
				case "statement-input":
					statementDragEnd(block, dropConnectorDom);
					break;
				case "output":
					outputDragEnd(block, dropConnectorDom);
					break;
			}
			var inGroup = !!closest(dropConnectorDom, "block-group");
			setBlockEnable(block, inGroup);
		} else {
			setBlockEnable(block, false);
		}

		activeConnectors = [];
		activeIOConnectors = [];
		dragBlock = null;
		dragBlockPreX = 0;
		dragBlockPreY = 0;

		container.querySelectorAll(".dragging").forEach(function(blockDom) {
			blockDom.classList.remove("dragging");
		});
		container.querySelectorAll(".block .connector.active").forEach(function(connectorDom) {
			connectorDom.classList.remove("active");
		});
	}

	function statementDragStart(block) {
		var preConnectorUid = connectors[block.connectors[0]].connectedTo;
		if (preConnectorUid) {
			var previousBlock = getBlockByConnector(preConnectorUid);
			var isInRoot = isInsideConnectorRoot(block);
			connectors[preConnectorUid].connectedTo = null;
			connectors[block.connectors[0]].connectedTo = null;

			if (isInRoot) {
				if (previousBlock.data.type === 'group') {
					previousBlock.dom.parentNode.parentNode.classList.remove('with-content');
				}
				removeFromStatementInput(block);
				redrawTree(previousBlock);
			}
		}

		activeConnectors = [];
		for (var connectorUid in connectors) {
			if (connectors[connectorUid].data.type !== "connector-empty" && getBlockByConnector(connectorUid).connectable && !connectorIsInBranch(connectorUid, block.uid)) {
				activeConnectors.push(connectorUid);
			}
		}
	}

	function statementDragEnd(block, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dragConnectorUid = dropConnectorDom.dataset.canConnectWith;

		var isDropping = isConnectorRoot(connectors[dropConnectorUid]) || isInsideConnectorRoot(getBlockByConnector(dropConnectorUid));
		setLogicConnection(dropConnectorUid, dragConnectorUid);

		if (isDropping) {
			connectorRootDragEnd(block, dropConnectorDom);
		} else {
			placeNestBlock(dropConnectorUid, dragConnectorUid);
		}
	}

	function outputDragStart(block) {
		var outputConnector = getOutputConnector(block);
		if (outputConnector.connectedTo) {
			block.dom.classList.remove('nest-block');

			var blockConnector = ioConnectors[outputConnector.connectedTo];
			var oldBlock = blocks[blockConnector.blockUid];

			//remove the logical conexions
			blockConnector.connectedTo = null;
			outputConnector.connectedTo = null;

			if (oldBlock.data.returnType && oldBlock.data.returnType.type === 'fromInput') {
				// updateSoftVar(oldBlock);
			}
			container.appendChild(block.dom);
		}

		activeIOConnectors = [];
		var ioConnector;
		var tempBlock;
		for (var connectorUid in ioConnectors) {
			ioConnector = ioConnectors[connectorUid];
			if (ioConnector.data.type === 'connector-input' && !ioConnector.connectedTo) {
				tempBlock = getBlockByConnector(connectorUid, true);
				if (tempBlock.connectable && sameConnectionType(block, tempBlock, ioConnector.data.acceptType) && !connectorIsInBranch(connectorUid, block.uid)) {
					activeIOConnectors.push(connectorUid);
				}
			}
		}
	}

	function outputDragEnd(block, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dragConnectorUid = getOutputConnector(block).uid;

		dropConnectorDom.appendChild(block.dom);
		block.dom.classList.add('nest-block');
		block.dom.style = null;

		ioConnectors[dropConnectorUid].connectedTo = dragConnectorUid;
		ioConnectors[dragConnectorUid].connectedTo = dropConnectorUid;

		var dropBlock = getBlockByConnector(dropConnectorUid, true);
		var dragBlock = getBlockByConnector(dragConnectorUid, true);

		if (dropBlock.data.returnType && dropBlock.data.returnType.type === 'fromInput') {
			// if (!dragBlock.data.returnType.pointer) {
			// 	updateSoftVar(dropBlock);
			// }
		}
	}

	function removeFromStatementInput(firstBlockToRemove) {
		var totalBlocksToRemove = [firstBlockToRemove.dom];
		var childConnectorUid = connectors[firstBlockToRemove.connectors[1]].connectedTo,
			blockToRemove,
			top = firstBlockToRemove.dom.offsetHeight;

		firstBlockToRemove.dom.classList.remove('inside-block');
		while (childConnectorUid) {
			blockToRemove = blocks[connectors[childConnectorUid].blockUid];
			totalBlocksToRemove.push(blockToRemove.dom);
			blockToRemove.dom.classList.remove('inside-block');
			blockToRemove.dom.style.transform = 'translate(' + 0 + 'px,' + top + 'px)';
			top += blockToRemove.dom.offsetHeight;
			childConnectorUid = connectors[blockToRemove.connectors[1]].connectedTo;
		}

		totalBlocksToRemove.forEach(function(blockDom) {
			container.appendChild(blockDom);
		});
	};

	function insertAfter(newDom, targetDom) {
		var parentEl = targetDom.parentNode;
		if (parentEl.lastChild == targetDom) {
			parentEl.appendChild(newDom);
		} else {
			parentEl.insertBefore(newDom, targetDom.nextSibling);
		}
	}

	function connectorRootDragEnd(dragBlock, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dropBlock = getBlockByConnector(dropConnectorUid);

		dragBlock.dom.classList.add('inside-block');
		dragBlock.dom.style.transform = null;

		if (isConnectorRoot(connectors[dropConnectorUid])) {
			var isGroup = dropBlock.data.type == "group";
			var contentDom = isGroup ? dropBlock.dom.querySelector('.group-content') : dropBlock.dom.querySelector(".statement-extension-content");
			contentDom.appendChild(dragBlock.dom);
			isGroup && 　dropBlock.dom.parentNode.parentNode.classList.add('with-content');
		} else {
			insertAfter(dragBlock.dom, dropBlock.dom);
		}

		var connectedUid = connectors[dragBlock.connectors[1]].connectedTo;
		var branchBlock;
		while (connectedUid) {
			branchBlock = blocks[connectors[connectedUid].blockUid];
			insertAfter(branchBlock.dom, dragBlock.dom);
			branchBlock.dom.classList.add('inside-bloq');
			branchBlock.dom.style = null;
			connectedUid = connectors[branchBlock.connectors[1]].connectedTo;
		}

		redrawTree(dropBlock);
	};

	function handleCollision(dragConnectors) {
		var found;
		var block;
		var dropConnector;
		var dragConnector;
		var uid;

		activeConnectors.forEach(function(dropConnectorUid) {
			dropConnector = connectors[dropConnectorUid];
			found = false;
			dragConnectors.forEach(function(dragConnectorUid) {
				dragConnector = connectors[dragConnectorUid];
				if ((dragConnector.data.type === dropConnector.data.accept) && itsOver(dragConnector.dom, dropConnector.dom, 10)) {
					found = true;
					uid = dragConnectorUid;
					return true;
				}
			});

			block = getBlockByConnector(dropConnectorUid);
			if (found) {
				dropConnector.dom.classList.add('active');
				dropConnector.dom.dataset.canConnectWith = uid;

				block.data.type === 'group' && block.dom.parentNode.classList.add('dragging');
			} else {
				block.data.type === 'group' && block.dom.parentNode.classList.remove('dragging');

				dropConnector.dom.classList.remove('active');
				dropConnector.dom.dataset.canConnectWith = "";
			}
		});
	}

	function handleIOCollision(block) {
		var dropConnector;
		var dragConnector = getOutputConnector(block);
		activeIOConnectors.forEach(function(connectorUid) {
			dropConnector = ioConnectors[connectorUid];
			if (itsOver(dragConnector.dom, dropConnector.dom) && sameConnectionType(blocks[dragConnector.blockUid], blocks[dropConnector.blockUid], dropConnector.data.acceptType)) {
				dropConnector.dom.classList.add('active');
			} else {
				dropConnector.dom.classList.remove('active');
			}
		});
	}

	function setLogicConnection(dropConnectorUid, dragConnectorUid) {
		if (connectors[dropConnectorUid].connectedTo) {
			var dropBottomConnectorUid, dragBlockLastBottomConnectorUid, dropTopConnectorUid, dragBlockFirstTopConnectorUid;
			switch (connectors[dropConnectorUid].data.type) {
				case 'connector-bottom':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
				case 'connector-top':
					dropTopConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockFirstTopConnectorUid = getFirstTopConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dropTopConnectorUid].connectedTo = dragBlockFirstTopConnectorUid;
					connectors[dragBlockFirstTopConnectorUid].connectedTo = dropTopConnectorUid;
					break;
				case 'connector-root':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
			}
		}
		connectors[dropConnectorUid].connectedTo = dragConnectorUid;
		connectors[dragConnectorUid].connectedTo = dropConnectorUid;
	};

	function placeNestBlock(dropConnectorUid, dragConnectorUid) {
		var dropBlock = getBlockByConnector(dropConnectorUid);
		switch (dropBlock.data.type) {
			case 'statement':
			case 'statement-input':
				redrawTree(getBlockByConnector(dragConnectorUid));
				break;
		}
	};

	function isConnectorRoot(connector) {
		return connector.data.type == 'connector-root';
	};

	function isInsideConnectorRoot(block) {
		var topConnector = connectors[block.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			return isConnectorRoot(connectedWithTopConnector) || isInsideConnectorRoot(getBlockByConnector(connectedWithTopConnector.uid));

		} else {
			return false;
		}
	};

	function sameConnectionType(dragBlock, dropBlock, dropConnectorAcceptType) {
		var dragConnectorType = getTypeFromBlock(dragBlock);
		if (typeof(dropConnectorAcceptType) === 'object') {
			dropConnectorAcceptType = getTypeFromDynamicDropdown(dropBlock, dropConnectorAcceptType);
		}
		return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
	};

	function getTypeFromBlock(block) {
		var result;
		switch (block.data.returnType.type) {
			case 'simple':
				result = block.data.returnType.value;
				break;
			case 'fromInput':
				var elementData;
				block.data.content.forEach(function(eleData) {
					if (eleData.blockInputId == block.data.returnType.blockInputId) {
						elementData = eleData;
						return true;
					}
				});
				var connector;
				elementData && ioConnectors.forEach(function(c) {
					if (c.blockUid == block.uid && c.data.name == elementData.name) {
						conector = c;
						return true;
					}
				});

				result = (connector && connector.connectedTo) ? getTypeFromBlock(getBlockByConnector(connector.connectedTo, true)) : '';
				break;
			case 'fromDynamicDropdown':
				result = getFromDynamicDropdownType(block, block.data.returnType.idDropdown, block.data.returnType.options);
				break;
			case 'fromDropdown':
				result = block.dom.querySelector('[data-content-id="' + block.data.returnType.idDropdown + '"]').value;
				break;
		}
		return result;
	};

	function getTypeFromDynamicDropdown(block, typeObject, softwareArrays) {
		// var attributeValue = block.$block.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').attr('data-value');
		// var selectedValue = block.$block.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').val();
		// var selectedVarNameOnDropdown = attributeValue || selectedValue;

		// var varData = _.find(softwareArrays[typeObject.options], {
		// 	name: selectedVarNameOnDropdown
		// });
		// if (varData) {
		// 	if (typeObject.pointer) {
		// 		varData.type = varData.type.replace(' *', '');
		// 	}
		// 	return varData.type;
		// }
		return '';

	};

	function getFromDynamicDropdownType(block, idDropdown, options, softwareArrays, componentsArray) {
		// var attributeValue = block.$block.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
		// var selectedValue = block.$block.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').val();
		// var varName = attributeValue || selectedValue;

		// var softVar = _.find(softwareArrays[options], {
		// 	name: varName
		// });
		// if (!softVar) {
		// 	for (var j in componentsArray.sensors) {
		// 		if (componentsArray.sensors[j].name === varName) {
		// 			if (componentsArray.sensors[j].type === 'Joystick' || componentsArray.sensors[j].type === 'LineFollower') {
		// 				return 'float *';
		// 			} else if (componentsArray.sensors[j].type === 'ButtonPad') {
		// 				return 'char';
		// 			} else {
		// 				return 'float';
		// 			}
		// 		}
		// 	}
		// }
		// if (softVar) {
		// 	if (block.data && block.data.returnType && block.data.returnType.pointer) {
		// 		softVar.type = softVar.type.replace(' *', '');
		// 	}
		// 	return softVar.type;
		// }
		return '';
	};

	function closest(dom, cls) {
		var tempDom = dom;
		while (tempDom && tempDom.tagName != "BODY" && !tempDom.classList.contains(cls)) {
			tempDom = tempDom.parentNode;
		}

		return tempDom.tagName == "BODY" ? null : tempDom;
	}

	function moveBlock(block, clientX, clientY) {
		var rect = block.dom.getBoundingClientRect();
		var distance = Math.round(Math.sqrt(Math.pow(dragBlockPreY - rect.top, 2) + Math.pow(dragBlockPreX - rect.left, 2)));

		var x = clientX - dragMouseX;
		var y = clientY - dragMouseY;
		block.dom.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
		if (distance > 10) {
			dragBlockPreX = rect.left;
			dragBlockPreY = rect.top;
		}
		if (block.data.type == "statement-input") {
			redrawTree(block);
		}

		return distance;
	}

	function setBlockConnectable(block, value) {
		block.data.content.forEach(function(elementData) {
			if (elementData.type != "block-input") {
				return;
			}

			block.ioConnectors.forEach(function(connectorUid) {
				var connector = ioConnectors[connectorUid];
				if (connector.data.type != "connector-input" || !connector.connectedTo) {
					return;
				}

				setBlockConnectable(getBlockByConnector(connector.connectedTo), value);
			});
		});
		block.connectable = true;
	}

	function setBlockEnable(block, value, includeConnected) {
		includeConnected = includeConnected != false;
		value ? block.dom.classList.remove("disabled") : block.dom.classList.add("disabled");
		block.data.content && block.data.content.forEach(function(elementData) {
			if (elementData.type != "block-input") {
				return;
			}

			block.ioConnectors.forEach(function(connectorUid) {
				var connector = ioConnectors[connectorUid];
				if (connector.data.type != "connector-input" || !connector.connectedTo) {
					return;
				}

				setBlockEnable(getBlockByConnector(connector.connectedTo, true), value, false);
			});
		});
		block.enable = value;

		var tempBlock;
		var connectorUid;
		if (block.connectors[2]) {
			connectorUid = connectors[block.connectors[2]].connectedTo;
			while (connectorUid) {
				tempBlock = getBlockByConnector(connectorUid);
				setBlockEnable(tempBlock, value, false);
				connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
			}
		}

		if (!includeConnected || (block.data.type != "statement" && block.data.type != "statement-input")) {
			return;
		}

		connectorUid = connectors[block.connectors[1]].connectedTo;
		while (connectorUid) {
			tempBlock = getBlockByConnector(connectorUid);
			setBlockEnable(tempBlock, value, false);
			connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
		}
	}

	function redrawTree(block) {
		var rootBlock = getBlockByConnector(getFirstTopConnectorUid(block.uid));
		var bottomUid = connectors[rootBlock.connectors[1]].connectedTo;
		var transformProperties = translateRegExp.exec(rootBlock.dom.style.transform);
		var top = 0;
		var left = 0;
		var marginOffset = 2;
		if (transformProperties) {
			top = parseInt(transformProperties[4]);
			left = parseInt(transformProperties[1]);
		}
		top += rootBlock.dom.offsetHeight + marginOffset;

		var branchBlock;
		while (bottomUid) {
			branchBlock = getBlockByConnector(bottomUid);
			branchBlock.dom.style.transform = 'translate(' + left + 'px,' + top + 'px)';
			top += branchBlock.dom.offsetHeight + marginOffset;
			bottomUid = connectors[branchBlock.connectors[1]].connectedTo;
		}
	}

	function getTreeExtreme(uid, connectorPosition) {
		var block = getBlock(uid);
		var connectorUid = block.connectors[connectorPosition];
		var connectedToUid = connectors[connectorUid].connectedTo;
		if (connectedToUid) {
			return getTreeExtreme(connectors[connectedToUid].blockUid, connectorPosition);
		} else {
			return connectorUid;
		}
	};

	function getLastBottomConnectorUid(uid) {
		return getTreeExtreme(uid, 1);
	};

	function getFirstTopConnectorUid(uid) {
		return getTreeExtreme(uid, 0);
	};

	function connectorIsInBranch(connectorUid, uid) {
		return false;
		// var isInBlock = false;
		// var i = 0;
		// //miro si es uno de mis conectores
		// while (!isInBlock && (i < blocks[uid].connectors.length)) {
		// 	if (blocks[uid].connectors[i] === connectorUid) {
		// 		isInBlock = true;
		// 	} else {
		// 		i++;
		// 	}
		// }
		// i = 0;
		// while (!isInBlock && (i < blocks[uid].ioConnectors.length)) {
		// 	if (blocks[uid].ioConnectors[i] === connectorUid) {
		// 		isInBlock = true;
		// 	} else {
		// 		i++;
		// 	}
		// }

		// //type: connector-bottom
		// if (!isInBlock && blocks[uid].connectors[2] && connectors[blocks[uid].connectors[2]].connectedTo) {
		// 	isInBlock = connectorIsInBranch(connectorUid, connectors[connectors[blocks[uid].connectors[2]].connectedTo].blockUid);
		// }

		// //type: connector-root
		// if (!isInBlock && blocks[uid].connectors[1] && connectors[blocks[uid].connectors[1]].connectedTo) {
		// 	isInBlock = connectorIsInBranch(connectorUid, connectors[connectors[blocks[uid].connectors[1]].connectedTo].blockUid);
		// }
		// return isInBlock;
	};

	function getOutputConnector(block) {
		var uid;
		block.ioConnectors.forEach(function(ioConnectorUid) {
			if (ioConnectors[ioConnectorUid].data.type == "connector-output") {
				uid = ioConnectorUid;
				return true;
			}
		});

		return ioConnectors[uid];
	}

	function getBlockByConnector(uid, tag) {
		var connector = tag ? ioConnectors[uid] : connectors[uid];
		return getBlock(connector.blockUid);
	}

	function itsOver(dragConnectorDom, dropConnectorDom, margin) {
		margin = margin || 0;
		var dragRect = dragConnectorDom.getBoundingClientRect();
		var dropRect = dropConnectorDom.getBoundingClientRect();
		return dragRect.left < (dropRect.left + dropRect.width + margin) && (dragRect.left + dropRect.width) > (dropRect.left - margin) && dragRect.top < (dropRect.top + dropRect.height + margin) && (dragRect.top + dropRect.height) > (dropRect.top - margin);
	};

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	function validNumber(number) {
		var temp = number;
		var removedChar = 0;
		var i = 0;
		if (number[0] === '-') {
			temp = number.substring(1);
			i = 1;
		}

		var index = number.indexOf('.');
		while (i < number.length) {
			if ((number[i] === '.' && index < i) || (!isNumeric(number[i]) && number[i] !== '.')) {
				number = number.slice(0, i) + number.slice(i + 1, number.length);
				removedChar += 1;
			} else {
				i++;
			}
		}

		return {
			value: number,
			removedChar: removedChar
		};
	};

	function validString(value) {
		return value.replace(/(^|\b|[^\\])(\\\\)*\\$/g, '$&\\')
			.replace(/(^|\b|[^\\])((\\\\)*\")/g, '$1\\$2')
			.replace(/(^|\b|[^\\])((\\\\)*\/\*)/g, '$1\\$2')
			.replace(/(^|\b|[^\\])((\\\\)*\/\/)/g, '$1\\$2')
			.replace(/\$\'/g, '\$\\\'')
			.replace(/\$\&/g, '\$\\\&');
	};

	function validChar(value) {
		value = value.replace(/\$*/g, '');
		if (/^\\/g.test(value)) {
			if (/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g.test(value)) {
				value = value.match(/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g)[0];
			} else if (/^\\[bfnrtv0']/g.test(value)) {
				value = value.substring(0, 2);
			} else if (/^\\[%#!|"@~&?\/()=^`[+\]*,{};.:-]/g.test(value)) {
				value = value.charAt(1);
			} else {
				value = '\\\\';
			}
		} else if (/^(\')/g.test(value)) {
			value = '\\\'';
		} else {
			value = value.charAt(0);
		}

		return value;
	};

	function validComment(value) {
		return value.replace(/\*\//g, '')
			.replace(/\$\'/g, '\$\\\'')
			.replace(/\$\&/g, '\$\\\&');
	};


	function validName(name) {
		if (name && name.length > 0) {
			var i = 0,
				j = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}

			i = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}
			for (j = 0; j < reservedWords.length; j++) {
				if (name === reservedWords[j]) {
					name += '_';
					break;
				}
			}
		}
		return name;
	};

	function genUid() {
		var d = new Date().getTime();
		var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uid;
	};

	function init(_container) {
		container = _container;
	}

	function getBlock(uid) {
		return blocks[uid];
	}

	function createBlock(data) {
		return new Block(data);
	}

	function copyBlock(block, offsetX, offsetY) {

	}

	function removeBlock(block, redraw) {
		block.dom.removeEventListener("mousedown", onBlockMouseDown);
		if (mouseDownBlockDom && mouseDownBlockDom.dataset.uid == uid) {
			document.removeEventListener('mouseup', onBlockMouseUpBeforeMove);
			document.removeEventListener('mousemove', onBlockPreMouseMove);
			document.removeEventListener('mousemove', onBlockMouseMove);
			document.removeEventListener('mouseup', onBlockMouseUp);
		}

		switch (block.data.type) {
			case "statement-input":
			case "group":
				var tempBlock;
				var childConnector = connectors[block.connectors[2]].connectedTo;
				while (childConnector) {
					tempBlock = getBlockByConnector(childConnector);
					childConnector = connectors[tempBlock.connectors[1]].connectedTo;
					removeBlock(tempBlock);
				}
			case "statement":
				var topConnector = connectors[block.connectors[0]].connectedTo;
				var bottomConnector = connectors[block.connectors[1]].connectedTo;

				if (topConnector && bottomConnector) {
					connectors[topConnector].connectedTo = bottomConnector;
					connectors[bottomConnector].connectedTo = topConnector;
					redraw && redrawTree(getBlockByConnector(topConnector));
				} else if (topConnector) {
					connectors[topConnector].connectedTo = null;
					var previousBlock = blocks[connectors[topConnector].blockUid];
					if (previousBlock.data.type === 'group') {
						previousBlock.dom.parentNode.parentNode.classList.remove('with-content');
					}
					redraw && redrawTree(getBlockByConnector(topConnector));
				} else if (bottomConnector) {
					connectors[bottomConnector].connectedTo = null;
				}

				var tempConnector;
				block.ioConnectors.forEach(function(connectorUid) {
					tempConnector = ioConnectors[connectorUid];
					if ((tempConnector.data.type === 'connector-input') && tempConnector.connectedTo) {
						removeBlock(getBlockByConnector(tempConnector.connectedTo, true));
					}
				});
				break;
			case "output":
				var outputConnector = ioConnectors[block.ioConnectors[0]].connectedTo;
				outputConnector && (ioConnectors[outputConnector].connectedTo = null);
				break;
		}

		block.dom.remove();
		block.connectors.forEach(function(connectorUid) {
			delete connectors[connectorUid];
		});
		block.ioConnectors.forEach(function(connectorUid) {
			delete ioConnectors[connectorUid];
		});

		delete blocks[uid];
	}

	function getBlockCode(block) {

	}

	function getBlockStructure(block) {
		var result = {
			name: block.data.name,
			content: [],
			children: [],
			enable: block.enable,
		};

		var rootConnectorUid = block.connectors[2];
		if (rootConnectorUid) {
			var connectorUid = connectors[rootConnectorUid].connectedTo;
			var tempBlock;
			while (connectorUid) {
				tempBlock = getBlockByConnector(connectorUid);
				result.children.push(getBlockStructure(tempBlock.uid));
				connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
			}
		}

		var tempObject, value, selectedValue, attributeValue;
		var tempDom;
		block.data.content.forEach(function(elementData) {
			tempObject = null;
			// switch (elementData.type) {
			// 	case 'varInput':
			// 	case 'stringInput':
			// 	case 'numberInput':
			// 	case 'codeInput':
			// 	case 'commentInput':
			// 	case 'charInput':
			// 		tempDom = block.dom.querySelector('[data-content-id="' + elementData.id + '"]');
			// 		tempDom && tempDom.value && tempObject = {
			// 			type: elementData.type,
			// 			id: elementData.id,
			// 			value: tempDom.value
			// 		};
			// 		break;
			// 	case 'blockInput':
			// 		//get the inputs blocks inside in 1 level
			// 		var uuid,
			// 			connectedBlock;
			// 		uuid = block.getioConnectorUidByContentId(elementData.blockInputId);
			// 		if ((ioConnectors[uuid].data.type === 'connector-input') && ioConnectors[uuid].connectedTo) {
			// 			connectedBlock = utils.getBlockByConnector(ioConnectors[uuid].connectedTo, blocks, ioConnectors);
			// 			tempObject = {
			// 				type: elementData.type,
			// 				blockInputId: elementData.blockInputId,
			// 				value: connectedBlock.getBlocksStructure(fullStructure)
			// 			};
			// 		}

			// 		break;
			// 	case 'dynamicDropdown':
			// 		attributeValue = block.dom.find('select[data-content-id="' + elementData.id + '"][data-dropdowncontent="' + elementData.options + '"]').attr('data-value');
			// 		selectedValue = block.dom.find('select[data-content-id="' + elementData.id + '"][data-dropdowncontent="' + elementData.options + '"]').val();
			// 		//only software Vars get value from val(), hardware, use attribute or val()
			// 		var variableType = elementData.options;
			// 		var itsSoftwareValue = Object.keys(softwareArrays).indexOf(variableType);

			// 		if (itsSoftwareValue !== -1) {
			// 			value = selectedValue;
			// 		} else {
			// 			value = attributeValue || selectedValue;
			// 		}

			// 		if (value) {
			// 			tempObject = {
			// 				type: elementData.type,
			// 				id: elementData.id,
			// 				value: value
			// 			};
			// 		}
			// 		break;
			// 	case 'staticDropdown':
			// 		//value = block.dom.find('select[data-content-id="' + elementData.id + '"]').val();
			// 		value = block.$contentContainer.find('> select[data-content-id="' + elementData.id + '"]').val();
			// 		if (value) {
			// 			tempObject = {
			// 				type: elementData.type,
			// 				id: elementData.id,
			// 				value: value
			// 			};
			// 		}
			// 		break;
			// }

			tempObject && result.content.push(tempObject);
		});

		return result;
	}

	return {
		init: init,
		getBlock: getBlock,
		createBlock: createBlock,
	};
});
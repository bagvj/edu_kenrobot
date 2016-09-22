define(function() {
	var blocks = {};
	var connectors = {};
	var ioConnectors = {};
	var activeConnectors = [];
	var activeIOConnectors = [];

	var mouseDownBlockDom;
	var dragBlock;

	var startPreMouseMove;
	var preMouseMoveX;
	var preMouseMoveY;

	var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
	reservedWords = reservedWords.split(',');

	function Block(blockData) {
		this.data = blockData;
		this.uid = genUid();
		this.connectable = true;
		this.connectors = [];
		this.ioConnectors = [];

		var dom = document.createElement('div');
		dom.dataset.uid = this.uid;
		dom.classList.add("block");
		dom.classList.add("block-" + this.data.type);
		this.data.tags.forEach(function(tag) {
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
				buildConnectors(this);
				break;
		}

		blocks[this.uid] = this;
	}

	Block.prototype.getCode = function() {

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
					if (!connectorDom || !connectorDom.dataset) {
						console.dir(connectorData);
					}
					connectorDom.dataset.connectorId = connectorUid;
					connectorDom.classList.add("connector");
					connectorDom.classList.add(connectorData.type);

					connector.contentId = connectorDom.dataset.contentId;
					ioConnectors[connectorUid] = connector;
					block.ioConnectors.push(connectorUid);
					break;
				case "connector-output":
					connectorDom = document.createElement("div");
					connectorDom.dataset.connectorId = connectorUid;
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
		connectorDom.dataset.connectorId = connectorUid;
		connectorDom.classList.add("connector");
		connectorDom.classList.add(connectorData.type);
		containerDom.appendChild(connectorDom);
		connectors[connectorUid] = connector;
		block.connectors.push(connectorUid);

		return connectorDom;
	}

	function onBlockMouseDown(e) {
		console.log("onBlockMouseDown");
		if (e.target.tagName == "SELECT") {
			return;
		}

		e.stopPropagation();
		mouseDownBlockDom = e.currentTarget;
		startPreMouseMove = true;
		document.addEventListener('mouseup', onBlockMouseUpBeforeMove);
		document.addEventListener('mousemove', onBlockPreMouseMove);
	}

	function onBlockMouseUpBeforeMove(e) {
		console.log("onBlockMouseUpBeforeMove");
		mouseDownBlockDom = null;
		document.removeEventListener('mouseup', onBlockMouseUpBeforeMove);
		document.removeEventListener('mousemove', onBlockPreMouseMove);
	}

	function onBlockPreMouseMove(e) {
		console.log("onBlockPreMouseMove");
		if (startPreMouseMove) {
			startPreMouseMove = false;
			preMouseMoveX = e.pageX;
			preMouseMoveY = e.pageY;

			if(!mouseDownBlockDom) {
				console.dir(e);
			}
			var rect = mouseDownBlockDom.getBoundingClientRect();

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
		console.log("onBlockMouseMove");
		var block;
		if (mouseDownBlockDom) {
			block = getBlock(mouseDownBlockDom.dataset.uid);
			document.removeEventListener('mouseup', onBlockMouseUpBeforeMove);
			document.addEventListener('mouseup', onBlockMouseUp);
			mouseDownBlockDom.classList.add("dragging");

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

		block = dragBlock;

	}

	function onBlockMouseUp(e) {
		console.log("onBlockMouseUp");

		activeConnectors = [];
		activeIOConnectors = [];
		dragBlock = null;

		document.removeEventListener('mousemove', onBlockMouseMove);
		document.removeEventListener('mouseup', onBlockMouseUp);
	}

	function statementDragStart(block) {
		// var preConnector = connectors[block.connectors[0]].connectedTo;
		// if (preConnector) {
		// 	var previousBloq = getBlockByConnector(preConnector);
		// 	var itsInsideAConnectorRoot = itsInsideAConnectorRoot(bloq, bloqs, connectors);
		// 	connectors[preConnector].connectedTo = null;
		// 	connectors[bloq.connectors[0]].connectedTo = null;

		// 	if (itsInsideAConnectorRoot) {
		// 		if (previousBloq.bloqData.type === 'group') {
		// 			previousBloq.$bloq.removeClass('with--content');
		// 		}
		// 		removeFromStatementInput(bloq);
		// 		redrawTree(previousBloq, blocks, connectors);
		// 	}
		// }

		// activeConnectors = [];
		// connectors.forEach(function(connector, connectorUid) {
		// 	if (connector.data.type == 'connector-empty') {
		// 		return;
		// 	}

		// 	if (getBlockByConnector(connectorUid).isConnectable()) {
		// 		if (!connectorIsInBranch(connectorUid, block.uid, blocks, connectors)) {
		// 			activeConnectors.push(connectorUid);
		// 		}
		// 	}
		// });
	}

	function statementDragEnd(block) {

	}

	function outputDragStart(block) {

	}

	function outputDragEnd(block) {

	}

	function connectorIsInBranch(connectorUid, topBlockUid, _blocks, _connectors) {
		var isInBranch = false;
		var i = 0;
		while (!isInBranch && (i < _blocks[topBlockUid].connectors.length)) {
			if (bloqs[topBlockUid].connectors[i] === connectorUid) {
				isInBranch = true;
			} else {
				i++;
			}
		}
		i = 0;
		while (!isInBranch && (i < bloqs[topBlockUid].IOConnectors.length)) {
			if (bloqs[topBlockUid].IOConnectors[i] === connectorUid) {
				isInBranch = true;
			} else {
				i++;
			}
		}
		if (!isInBranch && bloqs[topBloqUuid].connectors[2] && connectors[bloqs[topBloqUuid].connectors[2]].connectedTo) {
			isInBranch = connectorIsInBranch(connectorUid, connectors[connectors[bloqs[topBloqUuid].connectors[2]].connectedTo].bloqUuid, bloqs, connectors);
		}
		if (!isInBranch && bloqs[topBloqUuid].connectors[1] && connectors[bloqs[topBloqUuid].connectors[1]].connectedTo) {
			isInBranch = connectorIsInBranch(connectorUid, connectors[connectors[bloqs[topBloqUuid].connectors[1]].connectedTo].bloqUuid, bloqs, connectors);
		}
		return isInBranch;
	};

	function getBlockByConnector(uid, tag) {
		var connector = tag ? ioConnectors[uid] : connectors[uid];
		return getBlock(connector.blockUid);
	}

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

	function createBlock(data) {
		return new Block(data);
	}

	function getBlock(uid) {
		return blocks[uid];
	}

	function removeBlock(uid) {
		var block = getBlock(uid);
		if (!block) {
			return;
		}

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

			case "statement":

				break;
			case "output":

				break;
		}

		block.dom.remove();
	}

	function validName(name) {

	}

	return {
		validName: validName,
		createBlock: createBlock,
		getBlock: getBlock,
		removeBlock: removeBlock,
	};
});
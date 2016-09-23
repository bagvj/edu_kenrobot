define(function() {
	var isNumeric = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	/**
	 * If the param is not a number, we set it to ''
	 * @param  number
	 */

	var validNumber = function(number) {
		var temp = number;
		var removedChar = 0;
		var i = 0;
		if (number[0] === '-') {
			temp = number.substring(1);
			i = 1;
		}
		// var count = occurrencesInString(number, '.', false);
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

	var getCaretPosition = function(el) {
		if (el.selectionStart) {
			return el.selectionStart;
		} else if (document.selection) {
			el.focus();

			var r = document.selection.createRange();
			if (r === null) {
				return 0;
			}

			var re = el.createTextRange(),
				rc = re.duplicate();
			re.moveToBookmark(r.getBookmark());
			rc.setEndPoint('EndToStart', re);

			return rc.text.length;
		}
		return 0;
	};

	var setCaretPosition = function(ctrl, pos) {
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		} else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	/**
	 * If the param has non escaped characters, escape them
	 * @param  value
	 */
	var validString = function(value) {
		value = value.replace(/(^|\b|[^\\])(\\\\)*\\$/g, '$&\\');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\")/g, '$1\\$2');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\/\*)/g, '$1\\$2');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\/\/)/g, '$1\\$2');
		value = value.replace(/\$\'/g, '\$\\\'');
		value = value.replace(/\$\&/g, '\$\\\&');

		return value;
	};

	/**
	 * Return the first valid char from a string
	 * @param  value
	 */
	var validChar = function(value) {
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

	/**
	 * If the param has a comment end, omit it
	 * @param  value
	 */
	var validComment = function(value) {
		value = value.replace(/\*\//g, '');
		value = value.replace(/\$\'/g, '\$\\\'');
		value = value.replace(/\$\&/g, '\$\\\&');

		return value;
	};

	/**
	 * Transform a function or variable name to make it "legal" in Arduino coding language
	 * @param  name
	 */
	var validName = function(name, softwareArrays) {
		var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
		reservedWords = reservedWords.split(',');
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
			var counter = [];
			if (softwareArrays) {
				var softwareVars = softwareArrays.softwareVars.concat(softwareArrays.voidFunctions, softwareArrays.returnFunctions);
				for (j = 0; j < softwareVars.length; j++) {
					if (name === softwareVars[j].name) {
						counter.push(j);

					}
				}
				if (counter.length === 2) {
					j = counter[1];
					//console.log('name === softwareVars[j].name', name === softwareVars[j].name, name, softwareVars[j].name);
					if (isNaN(name[name.length - 1])) {
						name += '1';
					} else {
						i = 0;
						var number, it;
						while (isNaN(name[i])) {
							it = i;
							i++;
						}
						number = parseInt(name.substring(it + 1, name.length), 10);
						number += 1;
						name = name.substring(0, it + 1);
						name += number.toString();
					}
				}
			}
		}
		return name;
	};

	var appendArrayInOneTime = function($container, $items) {
		var rawArray = $.map(
			$items,
			function(value) {

				return (value.get());

			}
		);

		// Add the raw DOM array to the current collection.
		$container.append(rawArray);
	};

	var generateUUID = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};
	var getNumericStyleProperty = function(style, prop) {
		return parseInt(style.getPropertyValue(prop), 10);
	};

	var drawDropdownOptions = function($element, arrayOptions) {
		var $tempElement, i,
			$items = [];

		$element.html('');
		for (i = 0; i < arrayOptions.length; i++) {
			$tempElement = $('<option>').attr({
				'data-var-id': arrayOptions[i].id,
				value: arrayOptions[i].name,
				'data-reference': arrayOptions[i].uid
			}).html(arrayOptions[i].name);
			$items.push($tempElement);
		}
		appendArrayInOneTime($element, $items);
	};

	var itsOver = function(dragConnector, dropConnector, margin) {
		margin = margin || 0;
		var dragConnectorOffset = dragConnector.offset(),
			dropConnectorOffset = dropConnector.offset();
		return dragConnectorOffset.left < (dropConnectorOffset.left + dropConnector[0].clientWidth + margin) && (dragConnectorOffset.left + dragConnector[0].clientWidth) > (dropConnectorOffset.left - margin) && dragConnectorOffset.top < (dropConnectorOffset.top + dropConnector[0].clientHeight + margin) && (dragConnectorOffset.top + dragConnector[0].clientHeight) > (dropConnectorOffset.top - margin);
	};

	var sameConnectionType = function(dragBlock, dropBlock, dropConnectorAcceptType, blocks, ioConnectors, softwareArrays) {
		var dragConnectorType = getTypeFromBlock(dragBlock, blocks, ioConnectors, softwareArrays);
		if (typeof(dropConnectorAcceptType) === 'object') {
			dropConnectorAcceptType = getTypeFromDynamicDropdown(dropBlock, dropConnectorAcceptType, softwareArrays);
		}
		return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
	};

	var getTypeFromDynamicDropdown = function(block, typeObject, softwareArrays) {
		var attributeValue = block.$block.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').attr('data-value');
		var selectedValue = block.$block.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').val();
		var selectedVarNameOnDropdown = attributeValue || selectedValue;

		var varData = _.find(softwareArrays[typeObject.options], {
			name: selectedVarNameOnDropdown
		});
		if (varData) {
			if (typeObject.pointer) {
				varData.type = varData.type.replace(' *', '');
			}
			return varData.type;
		}
		return '';

	};
	var getFromDynamicDropdownType = function(block, idDropdown, options, softwareArrays, componentsArray) {
		var attributeValue = block.$block.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
		var selectedValue = block.$block.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').val();
		var varName = attributeValue || selectedValue;

		var softVar = _.find(softwareArrays[options], {
			name: varName
		});
		if (!softVar) {
			for (var j in componentsArray.sensors) {
				if (componentsArray.sensors[j].name === varName) {
					if (componentsArray.sensors[j].type === 'Joystick' || componentsArray.sensors[j].type === 'LineFollower') {
						return 'float *';
					} else if (componentsArray.sensors[j].type === 'ButtonPad') {
						return 'char';
					} else {
						return 'float';
					}
				}
			}
		}
		if (softVar) {
			if (block.data && block.data.returnType && block.data.returnType.pointer) {
				softVar.type = softVar.type.replace(' *', '');
			}
			return softVar.type;
		}
		return '';
	};

	var getTreeExtreme = function(blockUid, blocks, connectors, connectorPosition) {
		if (connectors[blocks[blockUid].connectors[connectorPosition]].connectedTo) {
			return getTreeExtreme(connectors[connectors[blocks[blockUid].connectors[connectorPosition]].connectedTo].blockUid, blocks, connectors, connectorPosition);
		} else {
			return blocks[blockUid].connectors[connectorPosition];
		}
	};

	var getLastBottomConnectorUid = function(blockUid, blocks, connectors) {
		return getTreeExtreme(blockUid, blocks, connectors, 1);
	};

	var getFirstTopConnectorUid = function(blockUid, blocks, connectors) {
		return getTreeExtreme(blockUid, blocks, connectors, 0);
	};

	var getOutputConnector = function(block, ioConnectors) {
		var i = 0,
			outputConnector = null;
		while (!outputConnector && (i < block.ioConnectors.length)) {
			if (ioConnectors[block.ioConnectors[i]].data.type === 'connector-output') {
				outputConnector = ioConnectors[block.ioConnectors[i]];
			}
			i++;
		}
		if (!outputConnector) {
			throw 'outputBlock has no connector-output';
		} else {
			return outputConnector;
		}
	};

	var getNodesHeight = function(blockUid, blockIsTop, blocks, connectors) {
		var block = blocks[blockUid];
		var connectorPosition;
		if (blockIsTop) {
			connectorPosition = 1;
		} else {
			connectorPosition = 0;
		}
		if (connectors[block.connectors[connectorPosition]].connectedTo) {
			return block.$block.outerHeight(true) + getNodesHeight(connectors[connectors[block.connectors[connectorPosition]].connectedTo].blockUid, blockIsTop, blocks, connectors);
		} else {
			return block.$block.outerHeight(true);
		}
	};

	var getTreeHeight = function(blockUid, blocks, connectors) {
		var block = blocks[blockUid];
		var topConnectorUid = connectors[block.connectors[0]].connectedTo,
			bottomConnectorUid = connectors[block.connectors[1]].connectedTo;
		var height = block.$block.outerHeight(true);
		if (topConnectorUid) {
			height += getNodesHeight(connectors[topConnectorUid].blockUid, false, blocks, connectors);
		}
		if (bottomConnectorUid) {
			height += getNodesHeight(connectors[bottomConnectorUid].blockUid, true, blocks, connectors);
		}
		return height;
	};

	var drawBranch = function(blocks, connectors, topConnectorUid) {
		var branchUid = connectors[topConnectorUid].blockUid;
		//console.log('          ******* - branch - *********', branchUid);
		//console.log('          connector-top:', blocks[branchUid].connectors[0], 'connectedTo', connectors[blocks[branchUid].connectors[0]].connectedTo);
		//console.log('          connector-bottom:', blocks[branchUid].connectors[1], 'connectedTo', connectors[blocks[branchUid].connectors[1]].connectedTo);
		if (blocks[branchUid].connectors[2]) {
			//console.log('       connector-root:', blocks[branchUid].connectors[2], 'connectedTo', connectors[blocks[branchUid].connectors[2]].connectedTo);
			//console.log('                       ******* -  content **********');
			if (connectors[blocks[branchUid].connectors[2]].connectedTo) {
				drawBranch(blocks, connectors, connectors[blocks[branchUid].connectors[2]].connectedTo);
			}
			//console.log('                       ******* - end content **********');
		}
		if (connectors[blocks[branchUid].connectors[1]].connectedTo) {
			drawBranch(blocks, connectors, connectors[blocks[branchUid].connectors[1]].connectedTo);
		}
	};

	var drawTree = function(blocks, connectors) {
		//console.log('drawtree');
		//buscamos los tipo statement q no tienen un top conectado
		for (var uuid in blocks) {
			//console.log(blocks[uuid]);
			if (blocks[uuid].droppable && blocks[uuid].connectors[0] && !connectors[blocks[uuid].connectors[0]].connectedTo) {
				switch (blocks[uuid].data.type) {
					case 'statement':
					case 'statement-input':
						//console.log('******* - tree - *********', uuid);
						//console.log('connector-top:', blocks[uuid].connectors[0], 'connectedTo', connectors[blocks[uuid].connectors[0]].connectedTo);
						//console.log('connector-bottom:', blocks[uuid].connectors[1], 'connectedTo', connectors[blocks[uuid].connectors[1]].connectedTo);
						if (blocks[uuid].connectors[2]) {
							//console.log('connector-root:', blocks[uuid].connectors[2], 'connectedTo', connectors[blocks[uuid].connectors[2]].connectedTo);
							//console.log('           ccccccc -  content ccccccc');
							if (connectors[blocks[uuid].connectors[2]].connectedTo) {
								drawBranch(blocks, connectors, connectors[blocks[uuid].connectors[2]].connectedTo);
							}
							//console.log('           ccccccc - end content ccccccc');
						}
						if (connectors[blocks[uuid].connectors[1]].connectedTo) {
							drawBranch(blocks, connectors, connectors[blocks[uuid].connectors[1]].connectedTo);
						}
						break;
					case 'group':
						//console.log('******* - Group - *********', uuid);
						//console.log('connector-root:', blocks[uuid].connectors[2], 'connectedTo', connectors[blocks[uuid].connectors[2]].connectedTo);
						//console.log('           ccccccc -  content ccccccc');
						if (connectors[blocks[uuid].connectors[2]].connectedTo) {
							drawBranch(blocks, connectors, connectors[blocks[uuid].connectors[2]].connectedTo);
						}
						//console.log('           ccccccc - end content ccccccc');
						break;
				}
			}
		}
	};

	var getBranchsConnectors = function(blockUid, blocks, connectors) {
		var block = blocks[blockUid];
		var result = [];
		result = result.concat(block.connectors);
		//console.log('tiene un hijo', connectors[block.connectors[1]].connectedTo);
		if (connectors[block.connectors[1]].connectedTo) {
			var blockBranchUid = connectors[connectors[block.connectors[1]].connectedTo].blockUid;
			result = result.concat(getBranchsConnectors(blockBranchUid, connectors, blocks));
		}
		//si tiene hijos
		if (block.connectors[2] && connectors[block.connectors[2]].connectedTo) {
			var blockChildUid = connectors[connectors[block.connectors[2]].connectedTo].blockUid;
			result = result.concat(getBranchsConnectors(blockChildUid, connectors, blocks));
		}
		return result;
	};
	var getBranchsConnectorsNoChildren = function(blockUid, connectors, blocks) {
		var block = blocks[blockUid];
		var result = [];
		result = result.concat(block.connectors);
		//console.log('tiene un hijo', connectors[block.connectors[1]].connectedTo);
		if (connectors[block.connectors[1]].connectedTo) {
			var blockBranchUid = connectors[connectors[block.connectors[1]].connectedTo].blockUid;
			result = result.concat(getBranchsConnectorsNoChildren(blockBranchUid, connectors, blocks));
		}
		return result;
	};

	var getConnectorsUidByAcceptType = function(ioConnectors, type) {
		var result = [];
		for (var key in ioConnectors) {
			if (ioConnectors[key].data.acceptType === type) {
				result.push(ioConnectors[key].uuid);
			}
		}
		return result;
	};
	var getNotConnected = function(ioConnectors, uuids) {
		var result = [];
		for (var i = 0; i < uuids.length; i++) {
			if (!ioConnectors[uuids[i]].connectedTo) {
				result.push(uuids[i]);
			}
		}
		return result;
	};
	var getInputsConnectorsFromBlock = function(ioConnectors, blocks, block) {
		var result = [];
		var uuid;
		// connectedBlock;
		for (var i = 0; i < block.ioConnectors.length; i++) {
			uuid = block.ioConnectors[i];
			if (ioConnectors[block.ioConnectors[i]] && ioConnectors[uuid].data.type === 'connector-input') {
				result.push(uuid);
			}
		}
		return result;
	};

	var removeInputsConnectorsFromBlock = function(ioConnectors, block) {
		//remove visually all blockInputs
		block.$contentContainer.children('.blockinput').remove();
		block.$contentContainer.children('.removabletext').remove();
		//remove all ioConnectors
		for (var i = 0; i < block.ioConnectors.length; i++) {
			if (ioConnectors[block.ioConnectors[i]].data.type === 'connector-input') {
				delete ioConnectors[block.ioConnectors[i]];
			}
		}
	};
	var generateBlockInputConnectors = function(block) {
		var uuid;
		for (var i = 0; i < block.content.length; i++) {
			for (var j = 0; j < block.content[i].length; j++) {
				if (block.content[i][j].type === 'blockInput') {
					uuid = generateUUID();
					block.content[i][j].name = uuid;
					block.connectors.push({
						type: 'connector-input',
						accept: 'connector-output',
						name: uuid
					});
				}
			}
		}
	};
	var getBlockByConnector = function(connectorUid, blocks, connectors) {
		return blocks[connectors[connectorUid].blockUid];
	};

	var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
	var redrawTree = function(block, blocks, connectors) {
		var rootBlock = getBlockByConnector(getFirstTopConnectorUid(block.uuid, blocks, connectors), blocks, connectors);

		var somethingConnectedInBottomUid = connectors[rootBlock.connectors[1]].connectedTo,
			transformProperties = translateRegExp.exec(rootBlock.$block[0].style.transform),
			top,
			left,
			branchBlock;

		if (transformProperties) {
			top = parseInt(transformProperties[4]);
			left = transformProperties[1];
		} else {
			top = parseInt(rootBlock.$block[0].style.top) || rootBlock.$block.position().top;
			left = parseInt(rootBlock.$block[0].style.left) || rootBlock.$block.position().left;
		}
		top += rootBlock.$block.outerHeight(true);

		while (somethingConnectedInBottomUid) {
			branchBlock = blocks[connectors[somethingConnectedInBottomUid].blockUid];
			branchBlock.$block[0].style.transform = 'translate(' + left + 'px,' + top + 'px)';
			top += branchBlock.$block.outerHeight(true);
			somethingConnectedInBottomUid = connectors[branchBlock.connectors[1]].connectedTo;
		}

	};

	var isConnectorRoot = function(connector) {
		return connector.data.type === 'connector-root';
	};

	var isInsideConnectorRoot = function(block, blocks, connectors) {

		var topConnector = connectors[block.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			return isConnectorRoot(connectedWithTopConnector) || isInsideConnectorRoot(getBlockByConnector(connectedWithTopConnector.uuid, blocks, connectors), blocks, connectors);

		} else {
			return false;
		}
	};

	var getClassName = function(block, blocks, connectors) {
		var topConnector = connectors[block.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			var blockConnected = getBlockByConnector(connectedWithTopConnector.uuid, blocks, connectors);
			if (isConnectorRoot(connectedWithTopConnector) && (blockConnected.data.name === 'classChildren' || blockConnected.data.name === 'class')) {
				return blockConnected.$block.find('[data-content-id="NAME"]').val();
			} else {
				return getClassName(getBlockByConnector(connectedWithTopConnector.uuid, blocks, connectors), blocks, connectors);
			}
		} else {
			return undefined;
		}
	};

	var jqueryObjectsArrayToHtmlToInsert = function(arrayToTransform) {
		var rawArray = $.map(
			arrayToTransform,
			function(value) {

				// Return the unwrapped version. This will return
				// the underlying DOM nodes contained within each
				// jQuery value.
				return (value.get());

			}
		);
		return rawArray;
	};

	var connectorIsInBranch = function(connectorUid, topBlockUid, blocks, connectors) {
		var isInBlock = false;
		var i = 0;
		//miro si es uno de mis conectores
		while (!isInBlock && (i < blocks[topBlockUid].connectors.length)) {
			if (blocks[topBlockUid].connectors[i] === connectorUid) {
				isInBlock = true;
			} else {
				i++;
			}
		}
		i = 0;
		while (!isInBlock && (i < blocks[topBlockUid].ioConnectors.length)) {
			if (blocks[topBlockUid].ioConnectors[i] === connectorUid) {
				isInBlock = true;
			} else {
				i++;
			}
		}
		//si tengo hijos miro en ellos
		if (!isInBlock && blocks[topBlockUid].connectors[2] && connectors[blocks[topBlockUid].connectors[2]].connectedTo) {
			isInBlock = connectorIsInBranch(connectorUid, connectors[connectors[blocks[topBlockUid].connectors[2]].connectedTo].blockUid, blocks, connectors);
		}
		//si tengo enganchado algo abajo miro en ellos
		if (!isInBlock && blocks[topBlockUid].connectors[1] && connectors[blocks[topBlockUid].connectors[1]].connectedTo) {
			isInBlock = connectorIsInBranch(connectorUid, connectors[connectors[blocks[topBlockUid].connectors[1]].connectedTo].blockUid, blocks, connectors);
		}
		return isInBlock;
	};

	var hasClass = function(el, selector) {
		var className = ' ' + selector + ' ';

		if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
			return true;
		}

		return false;
	};

	var getTypeFromBlock = function(block, blocks, ioConnectors, softwareArrays) {
		var result;
		if (!block) {
			console.error('We cant get the type if we dont have a block');
		}
		if (!block.data.returnType) {
			console.error('we cant get the type from a block without returnType ' + block.data.name);
		}
		switch (block.data.returnType.type) {
			case 'simple':
				result = block.data.returnType.value;
				break;
			case 'fromInput':
				var contentData = _.find(block.data.content[0], {
					blockInputId: block.data.returnType.blockInputId
				});
				var connector = _.find(ioConnectors, {
					blockUid: block.uuid,
					data: {
						name: contentData.name
					}
				});
				if (connector && connector.connectedTo) {
					result = getTypeFromBlock(getBlockByConnector(connector.connectedTo, blocks, ioConnectors), blocks, ioConnectors, softwareArrays);
				} else {
					result = '';
				}
				break;
			case 'fromDynamicDropdown':
				result = getFromDynamicDropdownType(block, block.data.returnType.idDropdown, block.data.returnType.options, softwareArrays, block.componentsArray);
				break;
			case 'fromDropdown':
				result = block.$block.find('[data-content-id="' + block.data.returnType.idDropdown + '"]').val();
				break;
			default:
				throw 'we cant get the type from this block: ' + block.data.name + ' ' + JSON.stringify(block.data.returnType);
		}
		return result;
	};
	var occurrencesInString = function(string, subString, allowOverlapping) {
		string += '';
		subString += '';
		if (subString.length <= 0) {
			return string.length + 1;
		}

		var n = 0,
			pos = 0;
		var step = (allowOverlapping) ? (1) : (subString.length);

		while (true) {
			pos = string.indexOf(subString, pos);
			if (pos >= 0) {
				n++;
				pos += step;
			} else {
				break;
			}
		}
		return (n);
	};

	var getParent = function(block, blocks, ioConnectors) {
		var connector = getOutputConnector(block, ioConnectors);
		return getBlockByConnector(connector.connectedTo, blocks, ioConnectors);

	};

	var getArgsFromBlock = function(block, blocks, ioConnectors) {
		var result;
		if (!block) {
			throw 'wadafak';
		}

		while (!block.data.arguments) {
			block = getParent(block, blocks, ioConnectors);
		}
		var contentData = _.find(block.data.content[0], {
			blockInputId: block.data.arguments.blockInputId
		});
		var connector = _.find(ioConnectors, {
			blockUid: block.uuid,
			data: {
				name: contentData.name
			}
		});
		if (connector && connector.connectedTo) {
			var childBlock = getBlockByConnector(connector.connectedTo, blocks, ioConnectors);
			var code = childBlock.getCode();
			result = {
				code: code,
				block: childBlock.uuid,
				funcName: '',
				size: occurrencesInString(code, ',', false) + 1
			};
		} else {
			result = {
				code: '',
				block: '',
				funcName: '',
				size: 0
			};
		}
		return result;
	};

	var drawSoftwareVars = function(softwareArrays) {
		for (var i = 0; i < softwareArrays.softwareVars.length; i++) {
			//console.log('name: ', softwareArrays.softwareVars[i].name, 'type: ', softwareArrays.softwareVars[i].type);
		}
	};

	var drawSoftwareArray = function(softwareArrays) {
		console.info('drawSoftwareArray');
		drawSoftwareVars(softwareArrays);
		console.info('returnFunctions');
		for (var i = 0; i < softwareArrays.returnFunctions.length; i++) {
			//console.log('name: ', softwareArrays.returnFunctions[i].name, 'type: ', softwareArrays.returnFunctions[i].type);
		}
	};

	var fillSchemaWithContent = function(originalBlockSchema, data) {
		var blockSchema = _.clone(originalBlockSchema, true),
			k,
			found;

		if (data && data.content) {
			for (var i = 0; i < data.content[0].length; i++) {

				switch (data.content[0][i].type) {
					case 'varInput':
					case 'numberInput':
					case 'stringInput':
					case 'charInput':
					case 'dynamicDropdown':
					case 'staticDropdown':
					case 'multilineCodeInput':
					case 'multilineCommentInput':
						k = 0;
						found = false;
						while (!found && (k < blockSchema.content[0].length)) {
							if (data.content[0][i].id === blockSchema.content[0][k].id) {
								found = true;
								blockSchema.content[0][k].value = data.content[0][i].value;
							}
							k++;
						}
						if (!found) {
							throw 'Attribute on blockStructure not found in definition';
						}
						break;
					case 'blockInput':
						//we do nothing here
						break;
					default:
						throw 'we cant build that option ' + data.content[0][i].type;
				}
			}
		}

		return blockSchema;
	};

	var getCode = function(componentsArray, blocks) {
		var includeCode = '',
			globalVars = '',
			code = '',
			setupCode = '',
			bitblockLibs = false;
		if (blocks.varsBlock && blocks.setupBlock && blocks.loopBlock && componentsArray) {
			if (componentsArray.continuousServos.length >= 1 || componentsArray.servos.length >= 1 || componentsArray.oscillators.length >= 1) {
				includeCode += '#include <Servo.h>\n';
			}
			if (componentsArray.oscillators.length >= 1) {
				if (includeCode.indexOf('#include <Wire.h>') === -1) {
					includeCode += '#include <Wire.h>\n';
				}
				includeCode += '#include <BitblockOscillator.h>\n';
				bitblockLibs = true;
			}
			if (componentsArray.lcds.length >= 1) {
				includeCode += '#include <LiquidCrystal_I2C.h>\n';
			}
			if (componentsArray.clocks.length >= 1) {
				includeCode += '#include <DS1307RTC.h>\n#include <Time.h>\n';
			}
			if (componentsArray.hts221.length >= 1) {
				includeCode += '#include <DHT.h>\n';
				componentsArray.hts221.forEach(function(sensor) {
					globalVars += 'DHT ' + sensor.name + '(' + sensor.pin.s + ', DHT22);';
					setupCode += sensor.name + '.begin();';
				});
			}
			if (componentsArray.encoders.length >= 1) {
				includeCode += '#include <Encoder.h>\n';
			}
			if (componentsArray.ultrasounds.length >= 1) {
				includeCode += '#include <SR04.h>\n';
			}
			if (componentsArray.sensors.length >= 1) {
				componentsArray.sensors.forEach(function(sensor) {
					if (sensor.type === 'Joystick') {
						includeCode += '#include <BitblockJoystick.h>\n#include <Wire.h>\n';
						bitblockLibs = true;
					} else if (sensor.type === 'ButtonPad') {
						includeCode += '#include <BitblockButtonPad.h>\n';
						bitblockLibs = true;
					} else if (sensor.type === 'LineFollower') {
						includeCode += '#include <BitblockLineFollower.h>\n';
						bitblockLibs = true;
					}
				});
			}
			//*******BUZZERS*******//
			if (componentsArray.buzzers.length >= 1) {
				componentsArray.buzzers.forEach(function(buzzer) {
					globalVars += 'int ' + buzzer.name + ' = ' + (buzzer.pin.s || '') + ';';
					setupCode += 'pinMode(' + buzzer.name + ', OUTPUT);';
				});
			}
			//*******CLOCKS*******//
			if (componentsArray.clocks.length >= 1) {
				componentsArray.clocks.forEach(function(clock) {
					globalVars += 'tmElements_t ' + clock.name + ';';
				});
			}
			//*******CONTINUOUSSERVOS*******//
			if (componentsArray.continuousServos.length >= 1) {
				componentsArray.continuousServos.forEach(function(continuousServo) {
					globalVars += 'Servo ' + continuousServo.name + ';';
					setupCode += continuousServo.name + '.attach(' + (continuousServo.pin.s || '') + ');';
				});
			}
			if (componentsArray.servos.length >= 1) {
				componentsArray.servos.forEach(function(servo) {
					globalVars += 'Servo ' + servo.name + ';';
					setupCode += servo.name + '.attach(' + (servo.pin.s || '') + ');';
				});
			}
			if (componentsArray.lcds.length >= 1) {
				componentsArray.lcds.forEach(function(lcd) {
					globalVars += 'LiquidCrystal_I2C ' + lcd.name + '(0x27, 16, 2);';
					setupCode += lcd.name + '.begin();' + lcd.name + '.clear();';
				});
			}
			if (componentsArray.leds.length >= 1) {
				componentsArray.leds.forEach(function(led) {
					globalVars += 'int ' + led.name + ' = ' + (led.pin.s || '') + ';';
					setupCode += 'pinMode(' + led.name + ', OUTPUT);';
				});
			}
			if (componentsArray.rgbs.length >= 1) {
				componentsArray.rgbs.forEach(function(rgb) {
					if (includeCode.indexOf('#include <RGBLed.h>') === -1) {
						includeCode += '#include <RGBLed.h>\n';
					}
					globalVars += 'RGBLed ' + rgb.name + '(' + (rgb.pin.r || '') + ',' + (rgb.pin.g || '') + ',' + (rgb.pin.b || '') + ');';
				});
			}
			if (componentsArray.oscillators.length >= 1) {
				componentsArray.oscillators.forEach(function(oscillator) {
					globalVars += 'Oscillator ' + oscillator.name + ';';
					setupCode += oscillator.name + '.attach(' + (oscillator.pin.s || '') + ');';
				});
			}
			if (componentsArray.encoders.length >= 1) {
				componentsArray.encoders.forEach(function(encoder) {
					globalVars += 'Encoder ' + encoder.name + '(' + (encoder.pin.sa || '') + ',' + (encoder.pin.sb || '') + ');';
				});
			}
			if (componentsArray.ultrasounds.length >= 1) {
				componentsArray.ultrasounds.forEach(function(ultrasound) {
					globalVars += 'SR04 ' + ultrasound.name + '(' + (ultrasound.pin.echo || '') + ',' + (ultrasound.pin.trigger || '') + ');';
				});
			}
			if (componentsArray.motors.length >= 1) {
				componentsArray.motors.forEach(function(motor) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoDCMotor ' + motor.name + '(' + (motor.pin.s || '') + ');';
				});
			}
			if (componentsArray.SEN006s.length >= 1) {
				componentsArray.SEN006s.forEach(function(joystick) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoJoystick ' + joystick.name + '(' + (joystick.pin.x || '') + ', ' + (joystick.pin.y || '') + ');';
				});
			}
			if (componentsArray.SEN017s.length >= 1) {
				componentsArray.SEN017s.forEach(function(lineTracking) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoLineTracking ' + lineTracking.name + '(' + (lineTracking.pin.d1 || '') + ', ' + (lineTracking.pin.d2 || '') + ', ' + (lineTracking.pin.d3 || '') + ', ' + (lineTracking.pin.d4 || '') + ');';
				});
			}
			if (componentsArray.ACT002s.length >= 1) {
				componentsArray.ACT002s.forEach(function(rgbLed) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoRGBLed ' + rgbLed.name + '(' + (rgbLed.pin.s || '') + ');';
				});
			}
			if (componentsArray.ACT005s.length >= 1) {
				componentsArray.ACT005s.forEach(function(buzzer) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoBuzzer ' + buzzer.name + '(' + (buzzer.pin.s || '') + ');';
				});
			}
			if (componentsArray.ACT008s.length >= 1) {
				componentsArray.ACT008s.forEach(function(segment) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'Ro7SegmentDisplay ' + segment.name + '(' + (segment.pin.data || '') + ', ' + (segment.pin.clk || '') + ');';
				});
			}
			if (componentsArray.ACT009s.length >= 1) {
				componentsArray.ACT009s.forEach(function(lcd) {
					if (includeCode.indexOf('#include <RoSys.h>') === -1) {
						includeCode += '#include <RoSys.h>\n';
					}
					globalVars += 'RoLedMartix ' + lcd.name + '(' + (lcd.pin.data || '') + ', ' + (lcd.pin.clk || '') + ', ' + (lcd.pin.cs || '') + ');';
				});
			}

			if (componentsArray.sensors.length >= 1) {
				componentsArray.sensors.forEach(function(sensor) {
					if (sensor.type === 'analog' || sensor.type === 'digital') {
						globalVars += 'int ' + sensor.name + ' = ' + (sensor.pin.s || '') + ';';
						setupCode += 'pinMode(' + sensor.name + ',' + (sensor.pinMode || 'INPUT') + ' );';
					} else if (sensor.type === 'Joystick') {
						globalVars += 'Joystick ' + sensor.name + '(' + (sensor.pin.x || '') + ',' + (sensor.pin.y || '') + ',' + (sensor.pin.k || '') + ');';
					} else if (sensor.type === 'ButtonPad') {
						globalVars += 'ButtonPad ' + sensor.name + '(' + (sensor.pin.s || '') + ');';
					} else if (sensor.type === 'LineFollower') {
						globalVars += 'LineFollower ' + sensor.name + '(' + (sensor.pin.s1 || '') + ',' + (sensor.pin.s2 || '') + ');';
					} else if (sensor.type === 'US') {
						globalVars += 'US ' + sensor.name + '(' + (sensor.pin.trigger || '') + ',' + (sensor.pin.echo || '') + ');';
					}
				});
			}
			if (componentsArray.serialElements.length >= 1) {
				componentsArray.serialElements.forEach(function(serialElement) {
					setupCode += "Serial.begin(" + (serialElement.baudRate || '') + ");";
				});
			}
			code = '\n/***   Included libraries  ***/\n' + includeCode + '\n\n/***   Global variables and function definition  ***/\n' + globalVars + blocks.varsBlock.getCode() + '\n\n/***   Setup  ***/\n' + blocks.setupBlock.getCode(setupCode) + '\n\n/***   Loop  ***/\n' + blocks.loopBlock.getCode();
		} else {
			//console.log('cant generate code');
		}

		return code;
	};

	var splice = function(string, idx, rem, s) {

		return (string.slice(0, idx) + s + string.slice(idx + Math.abs(rem)));
	};

	var executeFunctionOnConnectedStatementBlocks = function(functionToExecute, block, blocks, connectors) {
		var connector = connectors[block.connectors[1]].connectedTo,
			tempBlock;

		while (connector) {
			tempBlock = getBlockByConnector(connector, blocks, connectors);
			tempBlock[functionToExecute]();
			connector = connectors[tempBlock.connectors[1]].connectedTo;
		}
	};

	var delay = (function() {
		var timer = 0;
		return function(callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var getEmptyComponentsArray = function() {
		return {
			leds: [],
			rgbs: [],
			sensors: [],
			buzzers: [],
			servos: [],
			continuousServos: [],
			oscillators: [],
			lcds: [],
			serialElements: [],
			clocks: [],
			hts221: [],
			encoders: [],
			ultrasounds: [],
			motors: [],
			SEN006s: [],
			SEN017s: [],
			ACT002s: [],
			ACT005s: [],
			ACT008s: [],
			ACT009s: [],
		};
	};

	var getArduinoCode = function(componentsArray, program) {
		var varCode = getArduinoCodeFromBlock(program.vars),
			setupCode = getArduinoCodeFromBlock(program.setup),
			loopCode = getArduinoCodeFromBlock(program.loop);
		return varCode + setupCode + loopCode;
	};

	var getArduinoCodeFromBlock = function(block) {
		var code = '';
		if (block.enable) {
			var contentRegExp = new RegExp('{([A-Z0-9]+)}', 'g'),
				contentConnectionTypeRegExp = new RegExp('{([A-Z0-9]+\.connectionType)}', 'g'),
				regExpResult,
				contents = [];
			code = block.code;
			while (regExpResult = contentRegExp.exec(code)) {
				//console.log(regExpResult);
				contents.push(getContentFromBlock(regExpResult[1], block));
			}
			//twice bucle because regexp are not working fine
			for (var i = 0; i < contents.length; i++) {
				//console.log('+++');
				//console.log(contents[i].value);
				//console.log((contents[i].value || '').replace(/ \*/g, ''));
				code = code.replace(new RegExp('{' + contents[i].id + '\.withoutAsterisk}', 'g'), (contents[i].value || '').replace(/ \*/g, ''));
				code = code.replace(new RegExp('{' + contents[i].id + '\.connectionType}', 'g'), contents[i].connectionType || '');
				code = code.replace(new RegExp('{' + contents[i].id + '}( )*', 'g'), contents[i].value || '');
			};

			//search for regular expressions:
			var reg = /(.*)\?(.*):(.*)/g;
			if (reg.test(code)) {
				code = eval(code); // jshint ignore:line
			}
			//console.log(code);
		}
		return code;
	};

	var getContentFromBlock = function(contentId, block) {
		var content = {
			value: ''
		};

		if (contentId === 'STATEMENTS') {
			content.id = 'STATEMENTS';
			for (var i = 0; i < block.childs.length; i++) {
				content.value += getArduinoCodeFromBlock(block.childs[i]);
			}
		} else {
			content = _.filter(block.content[0], function(elem) {
				if (elem.id === contentId) {
					return true;
				} else if (elem.blockInputId === contentId) {
					elem.id = contentId;
					return true;
				}
			})[0];
		}
		if (content.type === 'blockInput' && content.value) {
			content.connectionType = getTypeFromBlockStructure(content.value);
			content.value = getArduinoCodeFromBlock(content.value);
		}
		return content;
	};

	var getTypeFromBlockStructure = function(block) {
		var type = '',
			content = null;
		if (block.returnType) {
			switch (block.returnType.type) {
				case 'simple':
					type = block.returnType.value;
					break;
				case 'fromDropdown':
					content = getContentFromBlock(block.returnType.idDropdown, block);
					type = content.value;
					break;
				case 'fromDynamicDropdown':
					//type = block.returnType.value;
					break;
				case 'fromInput':
					//type = block.returnType.value;
					break;
				default:
					throw 'Return type undefined';
			}
		} else {
			throw 'We cant get type from a block witouth a returnType';
		}
		return type;
	};

	var exports = {};
	exports.validString = validString;
	exports.validChar = validChar;
	exports.validComment = validComment;
	exports.delay = delay;
	exports.validNumber = validNumber;
	exports.validName = validName;
	exports.generateUUID = generateUUID;
	exports.getNumericStyleProperty = getNumericStyleProperty;
	exports.itsOver = itsOver;
	exports.getLastBottomConnectorUid = getLastBottomConnectorUid;
	exports.getFirstTopConnectorUid = getFirstTopConnectorUid;
	exports.getOutputConnector = getOutputConnector;
	exports.getTreeHeight = getTreeHeight;
	exports.getNodesHeight = getNodesHeight;
	exports.drawTree = drawTree;
	exports.drawBranch = drawBranch;
	exports.getBranchsConnectors = getBranchsConnectors;
	exports.getBranchsConnectorsNoChildren = getBranchsConnectorsNoChildren;
	exports.getConnectorsUidByAcceptType = getConnectorsUidByAcceptType;
	exports.getNotConnected = getNotConnected;
	exports.getInputsConnectorsFromBlock = getInputsConnectorsFromBlock;
	exports.generateBlockInputConnectors = generateBlockInputConnectors;
	exports.getBlockByConnector = getBlockByConnector;
	exports.redrawTree = redrawTree;
	exports.isConnectorRoot = isConnectorRoot;
	exports.isInsideConnectorRoot = isInsideConnectorRoot;
	exports.jqueryObjectsArrayToHtmlToInsert = jqueryObjectsArrayToHtmlToInsert;
	exports.connectorIsInBranch = connectorIsInBranch;
	exports.hasClass = hasClass;
	exports.appendArrayInOneTime = appendArrayInOneTime;
	exports.drawDropdownOptions = drawDropdownOptions;
	exports.getTypeFromBlock = getTypeFromBlock;
	exports.drawSoftwareVars = drawSoftwareVars;
	exports.drawSoftwareArray = drawSoftwareArray;
	exports.sameConnectionType = sameConnectionType;
	exports.getFromDynamicDropdownType = getFromDynamicDropdownType;
	exports.fillSchemaWithContent = fillSchemaWithContent;
	exports.getArgsFromBlock = getArgsFromBlock;
	exports.removeInputsConnectorsFromBlock = removeInputsConnectorsFromBlock;
	exports.getParent = getParent;
	exports.getCode = getCode;
	exports.splice = splice;
	exports.translateRegExp = translateRegExp;
	exports.executeFunctionOnConnectedStatementBlocks = executeFunctionOnConnectedStatementBlocks;
	exports.getClassName = getClassName;
	exports.getCaretPosition = getCaretPosition;
	exports.setCaretPosition = setCaretPosition;
	exports.getEmptyComponentsArray = getEmptyComponentsArray;
	exports.getArduinoCode = getArduinoCode;

	return exports;
});
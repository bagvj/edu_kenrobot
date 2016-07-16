'use strict';
angular.module('kenrobot')
	.service('bloqsUtils', function(_){
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

		var sameConnectionType = function(dragBloq, dropBloq, dropConnectorAcceptType, bloqs, IOConnectors, softwareArrays) {
			var dragConnectorType = getTypeFromBloq(dragBloq, bloqs, IOConnectors, softwareArrays);
			if (typeof(dropConnectorAcceptType) === 'object') {
				dropConnectorAcceptType = getTypeFromDynamicDropdown(dropBloq, dropConnectorAcceptType, softwareArrays);
			}
			return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
		};

		var getTypeFromDynamicDropdown = function(bloq, typeObject, softwareArrays) {
			var attributeValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').attr('data-value');
			var selectedValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').val();
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
		var getFromDynamicDropdownType = function(bloq, idDropdown, options, softwareArrays, componentsArray) {
			var attributeValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
			var selectedValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').val();
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
				if (bloq.bloqData && bloq.bloqData.returnType && bloq.bloqData.returnType.pointer) {
					softVar.type = softVar.type.replace(' *', '');
				}
				return softVar.type;
			}
			return '';
		};

		var getTreeExtreme = function(bloqUuid, bloqs, connectors, connectorPosition) {
			if (connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo) {
				return getTreeExtreme(connectors[connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo].bloqUuid, bloqs, connectors, connectorPosition);
			} else {
				return bloqs[bloqUuid].connectors[connectorPosition];
			}
		};

		var getLastBottomConnectorUuid = function(bloqUuid, bloqs, connectors) {
			return getTreeExtreme(bloqUuid, bloqs, connectors, 1);
		};

		var getFirstTopConnectorUuid = function(bloqUuid, bloqs, connectors) {
			return getTreeExtreme(bloqUuid, bloqs, connectors, 0);
		};

		var getOutputConnector = function(bloq, IOConnectors) {
			var i = 0,
				outputConnector = null;
			while (!outputConnector && (i < bloq.IOConnectors.length)) {
				if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--output') {
					outputConnector = IOConnectors[bloq.IOConnectors[i]];
				}
				i++;
			}
			if (!outputConnector) {
				throw 'outputBloq has no connector-output';
			} else {
				return outputConnector;
			}
		};

		var getNodesHeight = function(bloqUuid, bloqIsTop, bloqs, connectors) {
			var bloq = bloqs[bloqUuid];
			var connectorPosition;
			if (bloqIsTop) {
				connectorPosition = 1;
			} else {
				connectorPosition = 0;
			}
			if (connectors[bloq.connectors[connectorPosition]].connectedTo) {
				return bloq.$bloq.outerHeight(true) + getNodesHeight(connectors[connectors[bloq.connectors[connectorPosition]].connectedTo].bloqUuid, bloqIsTop, bloqs, connectors);
			} else {
				return bloq.$bloq.outerHeight(true);
			}
		};

		var getTreeHeight = function(bloqUuid, bloqs, connectors) {
			var bloq = bloqs[bloqUuid];
			var topConnectorUuid = connectors[bloq.connectors[0]].connectedTo,
				bottomConnectorUuid = connectors[bloq.connectors[1]].connectedTo;
			var height = bloq.$bloq.outerHeight(true);
			if (topConnectorUuid) {
				height += getNodesHeight(connectors[topConnectorUuid].bloqUuid, false, bloqs, connectors);
			}
			if (bottomConnectorUuid) {
				height += getNodesHeight(connectors[bottomConnectorUuid].bloqUuid, true, bloqs, connectors);
			}
			return height;
		};

		var drawBranch = function(bloqs, connectors, topConnectorUuid) {
			var branchUuid = connectors[topConnectorUuid].bloqUuid;
			//console.log('          ******* - branch - *********', branchUuid);
			//console.log('          connector--top:', bloqs[branchUuid].connectors[0], 'connectedTo', connectors[bloqs[branchUuid].connectors[0]].connectedTo);
			//console.log('          connector--bottom:', bloqs[branchUuid].connectors[1], 'connectedTo', connectors[bloqs[branchUuid].connectors[1]].connectedTo);
			if (bloqs[branchUuid].connectors[2]) {
				//console.log('       connector--root:', bloqs[branchUuid].connectors[2], 'connectedTo', connectors[bloqs[branchUuid].connectors[2]].connectedTo);
				//console.log('                       ******* -  content **********');
				if (connectors[bloqs[branchUuid].connectors[2]].connectedTo) {
					drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[2]].connectedTo);
				}
				//console.log('                       ******* - end content **********');
			}
			if (connectors[bloqs[branchUuid].connectors[1]].connectedTo) {
				drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[1]].connectedTo);
			}
		};

		var drawTree = function(bloqs, connectors) {
			//console.log('drawtree');
			//buscamos los tipo statement q no tienen un top conectado
			for (var uuid in bloqs) {
				//console.log(bloqs[uuid]);
				if (bloqs[uuid].droppable && bloqs[uuid].connectors[0] && !connectors[bloqs[uuid].connectors[0]].connectedTo) {
					switch (bloqs[uuid].bloqData.type) {
						case 'statement':
						case 'statement-input':
							//console.log('******* - tree - *********', uuid);
							//console.log('connector--top:', bloqs[uuid].connectors[0], 'connectedTo', connectors[bloqs[uuid].connectors[0]].connectedTo);
							//console.log('connector--bottom:', bloqs[uuid].connectors[1], 'connectedTo', connectors[bloqs[uuid].connectors[1]].connectedTo);
							if (bloqs[uuid].connectors[2]) {
								//console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
								//console.log('           ccccccc -  content ccccccc');
								if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
									drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
								}
								//console.log('           ccccccc - end content ccccccc');
							}
							if (connectors[bloqs[uuid].connectors[1]].connectedTo) {
								drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[1]].connectedTo);
							}
							break;
						case 'group':
							//console.log('******* - Group - *********', uuid);
							//console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
							//console.log('           ccccccc -  content ccccccc');
							if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
								drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
							}
							//console.log('           ccccccc - end content ccccccc');
							break;
					}
				}
			}
		};

		var getBranchsConnectors = function(bloqUuid, bloqs, connectors) {
			var bloq = bloqs[bloqUuid];
			var result = [];
			result = result.concat(bloq.connectors);
			//console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
			if (connectors[bloq.connectors[1]].connectedTo) {
				var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
				result = result.concat(getBranchsConnectors(bloqBranchUuid, connectors, bloqs));
			}
			//si tiene hijos
			if (bloq.connectors[2] && connectors[bloq.connectors[2]].connectedTo) {
				var bloqChildUuid = connectors[connectors[bloq.connectors[2]].connectedTo].bloqUuid;
				result = result.concat(getBranchsConnectors(bloqChildUuid, connectors, bloqs));
			}
			return result;
		};
		var getBranchsConnectorsNoChildren = function(bloqUuid, connectors, bloqs) {
			var bloq = bloqs[bloqUuid];
			var result = [];
			result = result.concat(bloq.connectors);
			//console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
			if (connectors[bloq.connectors[1]].connectedTo) {
				var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
				result = result.concat(getBranchsConnectorsNoChildren(bloqBranchUuid, connectors, bloqs));
			}
			return result;
		};

		var getConnectorsUuidByAcceptType = function(IOConnectors, type) {
			var result = [];
			for (var key in IOConnectors) {
				if (IOConnectors[key].data.acceptType === type) {
					result.push(IOConnectors[key].uuid);
				}
			}
			return result;
		};
		var getNotConnected = function(IOConnectors, uuids) {
			var result = [];
			for (var i = 0; i < uuids.length; i++) {
				if (!IOConnectors[uuids[i]].connectedTo) {
					result.push(uuids[i]);
				}
			}
			return result;
		};
		var getInputsConnectorsFromBloq = function(IOConnectors, bloqs, bloq) {
			var result = [];
			var uuid;
			// connectedBloq;
			for (var i = 0; i < bloq.IOConnectors.length; i++) {
				uuid = bloq.IOConnectors[i];
				if (IOConnectors[bloq.IOConnectors[i]] && IOConnectors[uuid].data.type === 'connector--input') {
					result.push(uuid);
				}
			}
			return result;
		};

		var removeInputsConnectorsFromBloq = function(IOConnectors, bloq) {
			//remove visually all bloqInputs
			bloq.$contentContainer.children('.bloqinput').remove();
			bloq.$contentContainer.children('.removabletext').remove();
			//remove all IOConnectors
			for (var i = 0; i < bloq.IOConnectors.length; i++) {
				if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--input') {
					delete IOConnectors[bloq.IOConnectors[i]];
				}
			}
		};
		var generateBloqInputConnectors = function(bloq) {
			var uuid;
			for (var i = 0; i < bloq.content.length; i++) {
				for (var j = 0; j < bloq.content[i].length; j++) {
					if (bloq.content[i][j].alias === 'bloqInput') {
						uuid = generateUUID();
						bloq.content[i][j].name = uuid;
						bloq.connectors.push({
							type: 'connector--input',
							accept: 'connector--output',
							name: uuid
						});
					}
				}
			}
		};
		var getBloqByConnectorUuid = function(connectorUuid, bloqs, connectors) {
			return bloqs[connectors[connectorUuid].bloqUuid];
		};

		var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
		var redrawTree = function(bloq, bloqs, connectors) {
			var rootBloq = getBloqByConnectorUuid(getFirstTopConnectorUuid(bloq.uuid, bloqs, connectors), bloqs, connectors);

			var somethingConnectedInBottomUuid = connectors[rootBloq.connectors[1]].connectedTo,
				transformProperties = translateRegExp.exec(rootBloq.$bloq[0].style.transform),
				top,
				left,
				branchBloq;

			if (transformProperties) {
				top = parseInt(transformProperties[4]);
				left = transformProperties[1];
			} else {
				top = parseInt(rootBloq.$bloq[0].style.top) || rootBloq.$bloq.position().top;
				left = parseInt(rootBloq.$bloq[0].style.left) || rootBloq.$bloq.position().left;
			}
			top += rootBloq.$bloq.outerHeight(true);

			while (somethingConnectedInBottomUuid) {
				branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
				branchBloq.$bloq[0].style.transform = 'translate(' + left + 'px,' + top + 'px)';
				top += branchBloq.$bloq.outerHeight(true);
				somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;
			}

		};

		var itsARootConnector = function(connector) {
			return connector.data.type === 'connector--root';
		};

		var itsInsideAConnectorRoot = function(bloq, bloqs, connectors) {

			var topConnector = connectors[bloq.connectors[0]];
			if (connectors[topConnector.connectedTo]) {
				var connectedWithTopConnector = connectors[topConnector.connectedTo];
				return itsARootConnector(connectedWithTopConnector) || itsInsideAConnectorRoot(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);

			} else {
				return false;
			}
		};

		var getClassName = function(bloq, bloqs, connectors) {
			var topConnector = connectors[bloq.connectors[0]];
			if (connectors[topConnector.connectedTo]) {
				var connectedWithTopConnector = connectors[topConnector.connectedTo];
				var bloqConnected = getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors);
				if (itsARootConnector(connectedWithTopConnector) && (bloqConnected.bloqData.name === 'classChildren' || bloqConnected.bloqData.name === 'class')) {
					return bloqConnected.$bloq.find('[data-content-id="NAME"]').val();
				} else {
					return getClassName(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);
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

		var connectorIsInBranch = function(connectorUuid, topBloqUuid, bloqs, connectors) {
			var isInBloq = false;
			var i = 0;
			//miro si es uno de mis conectores
			while (!isInBloq && (i < bloqs[topBloqUuid].connectors.length)) {
				if (bloqs[topBloqUuid].connectors[i] === connectorUuid) {
					isInBloq = true;
				} else {
					i++;
				}
			}
			i = 0;
			while (!isInBloq && (i < bloqs[topBloqUuid].IOConnectors.length)) {
				if (bloqs[topBloqUuid].IOConnectors[i] === connectorUuid) {
					isInBloq = true;
				} else {
					i++;
				}
			}
			//si tengo hijos miro en ellos
			if (!isInBloq && bloqs[topBloqUuid].connectors[2] && connectors[bloqs[topBloqUuid].connectors[2]].connectedTo) {
				isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[2]].connectedTo].bloqUuid, bloqs, connectors);
			}
			//si tengo enganchado algo abajo miro en ellos
			if (!isInBloq && bloqs[topBloqUuid].connectors[1] && connectors[bloqs[topBloqUuid].connectors[1]].connectedTo) {
				isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[1]].connectedTo].bloqUuid, bloqs, connectors);
			}
			return isInBloq;
		};

		var hasClass = function(el, selector) {
			var className = ' ' + selector + ' ';

			if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
				return true;
			}

			return false;
		};

		var getTypeFromBloq = function(bloq, bloqs, IOConnectors, softwareArrays) {
			var result;
			if (!bloq) {
				console.error('We cant get the type if we dont have a bloq');
			}
			if (!bloq.bloqData.returnType) {
				console.error('we cant get the type from a bloq without returnType ' + bloq.bloqData.name);
			}
			switch (bloq.bloqData.returnType.type) {
				case 'simple':
					result = bloq.bloqData.returnType.value;
					break;
				case 'fromInput':
					var contentData = _.find(bloq.bloqData.content[0], {
						bloqInputId: bloq.bloqData.returnType.bloqInputId
					});
					var connector = _.find(IOConnectors, {
						bloqUuid: bloq.uuid,
						data: {
							name: contentData.name
						}
					});
					if (connector && connector.connectedTo) {
						result = getTypeFromBloq(getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors), bloqs, IOConnectors, softwareArrays);
					} else {
						result = '';
					}
					break;
				case 'fromDynamicDropdown':
					result = getFromDynamicDropdownType(bloq, bloq.bloqData.returnType.idDropdown, bloq.bloqData.returnType.options, softwareArrays, bloq.componentsArray);
					break;
				case 'fromDropdown':
					result = bloq.$bloq.find('[data-content-id="' + bloq.bloqData.returnType.idDropdown + '"]').val();
					break;
				default:
					throw 'we cant get the type from this bloq: ' + bloq.bloqData.name + ' ' + JSON.stringify(bloq.bloqData.returnType);
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

		var getParent = function(bloq, bloqs, IOConnectors) {
			var connector = getOutputConnector(bloq, IOConnectors);
			return getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);

		};

		var getArgsFromBloq = function(bloq, bloqs, IOConnectors) {
			var result;
			if (!bloq) {
				throw 'wadafak';
			}

			while (!bloq.bloqData.arguments) {
				bloq = getParent(bloq, bloqs, IOConnectors);
			}
			var contentData = _.find(bloq.bloqData.content[0], {
				bloqInputId: bloq.bloqData.arguments.bloqInputId
			});
			var connector = _.find(IOConnectors, {
				bloqUuid: bloq.uuid,
				data: {
					name: contentData.name
				}
			});
			if (connector && connector.connectedTo) {
				var childBloq = getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);
				var code = childBloq.getCode();
				result = {
					code: code,
					bloq: childBloq.uuid,
					funcName: '',
					size: occurrencesInString(code, ',', false) + 1
				};
			} else {
				result = {
					code: '',
					bloq: '',
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

		var fillSchemaWithContent = function(originalBloqSchema, data) {
			var bloqSchema = _.clone(originalBloqSchema, true),
				k,
				found;

			if (data && data.content) {
				for (var i = 0; i < data.content[0].length; i++) {

					switch (data.content[0][i].alias) {
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
							while (!found && (k < bloqSchema.content[0].length)) {
								if (data.content[0][i].id === bloqSchema.content[0][k].id) {
									found = true;
									bloqSchema.content[0][k].value = data.content[0][i].value;
								}
								k++;
							}
							if (!found) {
								throw 'Attribute on bloqStructure not found in definition';
							}
							break;
						case 'bloqInput':
							//we do nothing here
							break;
						default:
							throw 'we cant build that option ' + data.content[0][i].alias;
					}
				}
			}

			return bloqSchema;
		};

		var getCode = function(componentsArray, bloqs) {
			var includeCode = '',
				globalVars = '',
				code = '',
				setupCode = '',
				bitbloqLibs = false;
			if (bloqs.varsBloq && bloqs.setupBloq && bloqs.loopBloq && componentsArray) {
				if (componentsArray.continuousServos.length >= 1 || componentsArray.servos.length >= 1 || componentsArray.oscillators.length >= 1) {
					includeCode += '#include <Servo.h>\n';
				}
				if (componentsArray.oscillators.length >= 1) {
					if (includeCode.indexOf('#include <Wire.h>') === -1) {
						includeCode += '#include <Wire.h>\n';
					}
					includeCode += '#include <BitbloqOscillator.h>\n';
					bitbloqLibs = true;
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
							includeCode += '#include <BitbloqJoystick.h>\n#include <Wire.h>\n';
							bitbloqLibs = true;
						} else if (sensor.type === 'ButtonPad') {
							includeCode += '#include <BitbloqButtonPad.h>\n';
							bitbloqLibs = true;
						} else if (sensor.type === 'LineFollower') {
							includeCode += '#include <BitbloqLineFollower.h>\n';
							bitbloqLibs = true;
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
					componentsArray.leds.forEach(function(leds) {
						globalVars += 'int ' + leds.name + ' = ' + (leds.pin.s || '') + ';';
						setupCode += 'pinMode(' + leds.name + ', OUTPUT);';
					});
				}
				if (componentsArray.rgbs.length >= 1) {
					componentsArray.rgbs.forEach(function(rgbs) {
						if (includeCode.indexOf('#include <RoSys.h>') === -1) {
							includeCode += '#include <RoSys.h>\n';
						}
						globalVars += 'RoRGB ' + rgbs.name + '(' + (rgbs.pin.r || '') + ',' + (rgbs.pin.g || '') + ',' + (rgbs.pin.b || '') + ');';
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
				code = '\n/***   Included libraries  ***/\n' + includeCode + '\n\n/***   Global variables and function definition  ***/\n' + globalVars + bloqs.varsBloq.getCode() + '\n\n/***   Setup  ***/\n' + bloqs.setupBloq.getCode(setupCode) + '\n\n/***   Loop  ***/\n' + bloqs.loopBloq.getCode();
			} else {
				//console.log('cant generate code');
			}

			return code;
		};

		var splice = function(string, idx, rem, s) {

			return (string.slice(0, idx) + s + string.slice(idx + Math.abs(rem)));
		};

		var executeFunctionOnConnectedStatementBloqs = function(functionToExecute, bloq, bloqs, connectors) {
			var connector = connectors[bloq.connectors[1]].connectedTo,
				tempBloq;

			while (connector) {
				tempBloq = getBloqByConnectorUuid(connector, bloqs, connectors);
				tempBloq[functionToExecute]();
				connector = connectors[tempBloq.connectors[1]].connectedTo;
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
			};
		};

		var getArduinoCode = function(componentsArray, program) {
			var varCode = getArduinoCodeFromBloq(program.vars),
				setupCode = getArduinoCodeFromBloq(program.setup),
				loopCode = getArduinoCodeFromBloq(program.loop);
			return varCode + setupCode + loopCode;
		};

		var getArduinoCodeFromBloq = function(bloq) {
			var code = '';
			if (bloq.enable) {
				var contentRegExp = new RegExp('{([A-Z0-9]+)}', 'g'),
					contentConnectionTypeRegExp = new RegExp('{([A-Z0-9]+\.connectionType)}', 'g'),
					regExpResult,
					contents = [];
				code = bloq.code;
				while (regExpResult = contentRegExp.exec(code)) {
					//console.log(regExpResult);
					contents.push(getContentFromBloq(regExpResult[1], bloq));
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

		var getContentFromBloq = function(contentId, bloq) {
			var content = {
				value: ''
			};

			if (contentId === 'STATEMENTS') {
				content.id = 'STATEMENTS';
				for (var i = 0; i < bloq.childs.length; i++) {
					content.value += getArduinoCodeFromBloq(bloq.childs[i]);
				}
			} else {
				content = _.filter(bloq.content[0], function(elem) {
					if (elem.id === contentId) {
						return true;
					} else if (elem.bloqInputId === contentId) {
						elem.id = contentId;
						return true;
					}
				})[0];
			}
			if (content.alias === 'bloqInput' && content.value) {
				content.connectionType = getTypeFromBloqStructure(content.value);
				content.value = getArduinoCodeFromBloq(content.value);
			}
			return content;
		};

		var getTypeFromBloqStructure = function(bloq) {
			var type = '',
				content = null;
			if (bloq.returnType) {
				switch (bloq.returnType.type) {
					case 'simple':
						type = bloq.returnType.value;
						break;
					case 'fromDropdown':
						content = getContentFromBloq(bloq.returnType.idDropdown, bloq);
						type = content.value;
						break;
					case 'fromDynamicDropdown':
						//type = bloq.returnType.value;
						break;
					case 'fromInput':
						//type = bloq.returnType.value;
						break;
					default:
						throw 'Return type undefined';
				}
			} else {
				throw 'We cant get type from a bloq witouth a returnType';
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
		exports.getLastBottomConnectorUuid = getLastBottomConnectorUuid;
		exports.getFirstTopConnectorUuid = getFirstTopConnectorUuid;
		exports.getOutputConnector = getOutputConnector;
		exports.getTreeHeight = getTreeHeight;
		exports.getNodesHeight = getNodesHeight;
		exports.drawTree = drawTree;
		exports.drawBranch = drawBranch;
		exports.getBranchsConnectors = getBranchsConnectors;
		exports.getBranchsConnectorsNoChildren = getBranchsConnectorsNoChildren;
		exports.getConnectorsUuidByAcceptType = getConnectorsUuidByAcceptType;
		exports.getNotConnected = getNotConnected;
		exports.getInputsConnectorsFromBloq = getInputsConnectorsFromBloq;
		exports.generateBloqInputConnectors = generateBloqInputConnectors;
		exports.getBloqByConnectorUuid = getBloqByConnectorUuid;
		exports.redrawTree = redrawTree;
		exports.itsARootConnector = itsARootConnector;
		exports.itsInsideAConnectorRoot = itsInsideAConnectorRoot;
		exports.jqueryObjectsArrayToHtmlToInsert = jqueryObjectsArrayToHtmlToInsert;
		exports.connectorIsInBranch = connectorIsInBranch;
		exports.hasClass = hasClass;
		exports.appendArrayInOneTime = appendArrayInOneTime;
		exports.drawDropdownOptions = drawDropdownOptions;
		exports.getTypeFromBloq = getTypeFromBloq;
		exports.drawSoftwareVars = drawSoftwareVars;
		exports.drawSoftwareArray = drawSoftwareArray;
		exports.sameConnectionType = sameConnectionType;
		exports.getFromDynamicDropdownType = getFromDynamicDropdownType;
		exports.fillSchemaWithContent = fillSchemaWithContent;
		exports.getArgsFromBloq = getArgsFromBloq;
		exports.removeInputsConnectorsFromBloq = removeInputsConnectorsFromBloq;
		exports.getParent = getParent;
		exports.getCode = getCode;
		exports.splice = splice;
		exports.translateRegExp = translateRegExp;
		exports.executeFunctionOnConnectedStatementBloqs = executeFunctionOnConnectedStatementBloqs;
		exports.getClassName = getClassName;
		exports.getCaretPosition = getCaretPosition;
		exports.setCaretPosition = setCaretPosition;
		exports.getEmptyComponentsArray = getEmptyComponentsArray;
		exports.getArduinoCode = getArduinoCode;

		return exports;
	});
'use strict';
angular.module('kenrobot')
	.controller('SoftwareTabCtrl', function($scope, common, bloqs, $translate, $rootScope, $document, $log, $window, $timeout) {
		$scope.onFieldKeyUp = function(event) {
			switch (event.keyCode) {
				case 46:
				case 8:
					if ($document[0].activeElement.attributes['data-bloq-id']) {
						event.preventDefault();
						var bloq = bloqs.bloqs[$document[0].activeElement.attributes['data-bloq-id'].value];
						if (bloq.bloqData.type !== 'group' && bloqs.bloqs[bloq.uuid].isConnectable()) {
							bloqs.removeBloq($document[0].activeElement.attributes['data-bloq-id'].value, true);
							$scope.$field.focus();
						}
					}
					break;
			}
		};

		$scope.enableBloqFromContextMenu = function(bloq) {
			bloq.enable();
			// $scope.saveBloqStep();
		};
		$scope.disableBloqFromContextMenu = function(bloq) {
			bloq.disable();
			// $scope.saveBloqStep();
		};
		$scope.removeBloqFromContextMenu = function(bloq) {
			bloqs.removeBloq(bloq.uuid, true);
			//saveBloqStep from here to not listen remove event from children and store one step for children
			// $scope.saveBloqStep();
		};

		$scope.duplicateBloqFromContextMenu = function(bloq) {
			var position = bloq.$bloq[0].getBoundingClientRect();
			copyBloq({
				structure: bloq.getBloqsStructure(),
				top: position.top,
				left: position.left
			});
		};

		function contextMenuDocumentHandler(event) {
			var bloq = $(event.target).closest('.bloq');
			var bloqUuid = bloq.attr('data-bloq-id');

			if (bloqUuid && !bloq.hasClass('bloq--group') && bloqs.bloqs[bloqUuid].isConnectable()) {
				event.preventDefault();
				$scope.$apply(function() {
					$scope.contextMenuBloq = bloqs.bloqs[bloqUuid];
				});
				if ((angular.element($window).height() - event.pageY) > $contextMenu.height()) {
					$contextMenu.css({
						display: 'block',
						left: event.pageX + 'px',
						top: event.pageY + 'px'
					});
				} else {
					$contextMenu.css({
						display: 'block',
						left: event.pageX + 'px',
						top: (event.pageY - $contextMenu.height()) + 'px'
					});
				}

			} else {
				$contextMenu.css({
					display: 'none'
				});
			}
		}

		function clickDocumentHandler() {
			$contextMenu.css({
				display: 'none'
			});
		}

		function copyBloq(bloq) {

			var newBloq = bloqs.buildBloqWithContent(bloq.structure, $scope.componentsArray, common.bloqsSchemas);

			newBloq.doConnectable();
			newBloq.disable();

			newBloq.$bloq[0].style.transform = 'translate(' + (bloq.left - 50) + 'px,' + (bloq.top - 100) + 'px)';
			$scope.$field.append(newBloq.$bloq);
			var i = 0;
			if (newBloq.varInputs) {
				for (i = 0; i < newBloq.varInputs.length; i++) {
					newBloq.varInputs[i].keyup();
				}
			}
		}
		bloqs.updateDropdowns();

		var $contextMenu = $('#bloqs-context-menu');
		$scope.$field = $('#bloqs--field').last();

		$document.on('contextmenu', contextMenuDocumentHandler);
		$document.on('click', clickDocumentHandler);

		$timeout(function() {
			$scope.refreshSoftware();
		}, 100);
	});
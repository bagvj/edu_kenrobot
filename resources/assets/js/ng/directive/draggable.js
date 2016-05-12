'use strict';
angular.module('kenrobot')
	.directive('draggable', function() {
		return function(scope, element, attrs) {
			var el = element[0];

			el.draggable = true;

			el.addEventListener('dragstart', function(e) {

				e.dataTransfer.effectAllowed = 'move';

				e.dataTransfer.setData('mouseOffsetX', e.offsetX);
				e.dataTransfer.setData('mouseOffsetY', e.offsetY);

				e.dataTransfer.setData('dragtype:' + attrs.dragtype, '');
				e.dataTransfer.setData('dragtype', attrs.dragtype);
				e.dataTransfer.setData('dragcategory', attrs.dragcategory);
				e.dataTransfer.setData('dragid', attrs.dragid);

				this.classList.add('dragging');

				return false;

			}, false);

			el.addEventListener('dragend', function() {
				this.classList.remove('dragging');
				return false;
			}, false);
	};
});

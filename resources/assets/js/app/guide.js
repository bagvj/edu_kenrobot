define(['vendor/jquery.cookie', './util'], function(_, util) {
	var guideCover;
	var guideCoverTime;

	function init() {
		$(window).on('keyup', onGuideCoverNext);
		guideCover = $('.guide-cover').on('click', onGuideCoverNext);
		$('.guide-cover .guide-skip').on('click', onGuideSkipClick);

		if(!$.cookie('has_visit')) {
			setTimeout(onGuideCoverNext, 1000);
			// onGuideCoverNext();
		}
	}

	function onGuideSkipClick(e) {
		guideCover.hide();
		$('.guide-highlight').removeClass('guide-highlight');

		$.cookie('has_visit', true);

		$('.tabpanel .tablist li:eq(0) > button').click();
	}

	function onGuideCoverNext(e) {
		var now = new Date().getTime();
		if(guideCoverTime && guideCoverTime + 1000 > now) {
			return;
		}

		if(e && e.keyCode && e.keyCode != 32) {
			return;
		}

		guideCoverTime = now;

		var steps = $('.guide-step', guideCover);
		var index = steps.filter('.active').index();
		index = index + 1;
		if(index < steps.length) {
			guideCover.show();
			$('.guide-highlight').removeClass('guide-highlight');

			var step = steps.eq(index);
			util.toggleActive(step);
			var target = $(step.data('target'));
			target.addClass('guide-highlight');

			if(index == 1 || index == 2) {
				$('>button', target).click();
			}
		} else {
			onGuideSkipClick();
		}
	}

	return {
		init: init,
	};
});
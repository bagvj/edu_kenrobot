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
		if(index + 1 < steps.length) {
			guideCover.show();
			$('.guide-highlight').removeClass('guide-highlight');

			var step = steps.eq(index + 1);
			util.toggleActive(step);
			var target = $(step.data('target'));
			target.addClass('guide-highlight');
		} else {
			onGuideSkipClick();
		}
	}

	return {
		init: init,
	};
});
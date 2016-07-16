define(['vendor/jquery.cookie', './util'], function(_, util) {
	var guideCover;
	var guideCoverTime;

	function init() {
		guideCover = $('.guide-cover');

		if(!$.cookie('has_visit')) {
			$(window).on('keyup', onGuideCoverNext);
			guideCover.addClass("active").on('click', onGuideCoverNext);
			$('.guide-skip', guideCover).on('click', onGuideSkipClick);

			onGuideCoverNext();
		}
	}

	function onGuideSkipClick(e) {
		$('.guide-highlight').removeClass('guide-highlight');

		$(window).off('keyup', onGuideCoverNext);
		$('.guide-skip', guideCover).off('click', onGuideSkipClick);
		guideCover.off('click', onGuideCoverNext).removeClass("active").remove();
		guideCover = null;

		$.cookie('has_visit', true, {expires: 365});
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
define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function(_, util, emitor) {
	var tabs;
	var region;

	function init() {
		var region = $('.sidebar-region');
		$('> ul > li', region).on('click', onActionClick);
		tabs = $('.sidebar-tabs');

		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {
		$('li[data-action="hardware"]', region).click();
	}

	function onActionClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var action = li.data('action');
		if(action == "code") {
			li.addClass("fold");
			tabs.find('.tab.active').removeClass("active");
			tabs.removeClass("slide-in").removeClass("slide-out").removeClass("active");
		} else {
			var tab = tabs.find(".tab-" + action);
			var activeTab = tabs.find(".tab.active");
			if(activeTab.length == 0) {
				li.removeClass("fold");
				tab.addClass("active");

				tabs.removeClass("slide-out").addClass("active").addClass("slide-in");
			} else if(tab.hasClass("active")) {
				li.addClass("fold");
				tab.removeClass("active");

				tabs.removeClass("slide-in").addClass("slide-out").delay(300, "slide-out").queue("slide-out", function() {
					tabs.removeClass("active").removeClass("slide-out");
				});
				tabs.dequeue("slide-out");
			} else {
				activeTab.removeClass("active");
				tab.addClass("active");
			}
		}

		action != "project" && emitor.trigger("sidebar", "activeTab", action);
	}

	return {
		init: init,
	};
});
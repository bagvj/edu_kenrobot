define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var tabs;
	var region;

	function init() {
		var region = $('.sidebar-region');

		$('.logo', region).on('click', onLogoClick);
		$('.center > li', region).on('click', onTabClick);
		$('.bottom > li', region).on('click', onBottomTabClick);

		tabs = $('.sidebar-tabs');

		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {
		$('li[data-action="hardware"]', region).click();
	}

	function onTabClick(e) {
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

		emitor.trigger("sidebar", "activeTab", action);
	}

	function onLogoClick(e) {
		var isWeixin = navigator.userAgent.match(/MicroMessenger/) ? true : false;
		if(isWeixin) {
			window.location.href = window.location.pathname + "?" + new Date().getTime();
		} else {
			window.location.href = "http://www.kenrobot.com";
		}
	}

	function onBottomTabClick(e) {
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "share":
				emitor.trigger("share", "show");
				break;
			case "help": 
				emitor.trigger("help", "show");
				break;
		}
	}

	return {
		init: init,
	};
});
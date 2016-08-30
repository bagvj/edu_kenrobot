define(['vendor/jquery', 'vendor/director', 'app/config', 'app/util/emitor', './component/sidebar/sidebar', './component/content/content'], function(_, _, config, emitor, sidebar, content) {
	var router;

	function init() {
		$.when(doInit()).done(function() {
			emitor.trigger('app', 'start');
			// router.init();
		});
	}

	function doInit() {
		var promise = $.Deferred();

		printJoinUs();
		initRoute();

		sidebar.init();
		content.init();

		return promise.resolve();
	}

	function printJoinUs() {
		try{
			config.debug || console.log(config.greet);
		} catch(e) {}
	}

	function initRoute() {
		// var onLesson = function() {
		// 	emitor.trigger('cover', 'show');
		// }

		// var onChapterTask = function(chapterHash, taskHash) {
		// 	lesson.beginChapter(chapterHash, taskHash);
		// }

		// var routes = {
		// 	'/lesson/?': onLesson,
		// 	'/lesson/([0-9a-zA-Z]{6})/?': onChapterTask,
		// 	'/lesson/([0-9a-zA-Z]{6})/([0-9a-zA-Z]{6})/?': onChapterTask,
		// };
		// router = Router(routes);
	}

	return {
		init: init,
	}
});
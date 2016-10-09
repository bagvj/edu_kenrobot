define(['vendor/jquery', 'vendor/director', 'app/config', 'app/util/emitor', './controller/controller', './component/component'], function($1, $2, config, emitor, controller, component) {
	
	function init() {
		printJoinUs();
		initAjax();
		initRoute();

		controller.init();
		component.init();

		emitor.trigger('app', 'start');
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
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
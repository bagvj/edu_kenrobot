define(['jquery', 'bootstrap', 'util', 'EventManager', 'hardware', 'code', 'user', 'project', 'software', 'sidebar', 'board', 'component', 'library'], function($, _, util, EventManager, hardware, code, user, project, software, sidebar, board, component, library) {
	function init() {
		initAjax();

		user.init();
		sidebar.init();
		board.init();
		component.init();
		library.init();
		hardware.init();
		software.init();
		code.init(hardware.getNodes);

		// $(window).bind('beforeunload', function(){
		// 	return '您的项目尚未保存，确定离开此页面吗？';
		// });

		$('.login-hint-layer').on('click', function(){
			$(this).remove();
		});

		$.ajax({
			url: '/config',
			dataType: 'json',
		}).done(onLoadSuccess);
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function onLoadSuccess(result) {
		board.load(result.boards);
		component.load(result.components);
		library.load(result.libraries);

		hardware.load(result);

		project.init();
	}

	return {
		init: init,
	}
});
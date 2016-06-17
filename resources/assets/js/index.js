require.config({
	baseUrl: "assets/js",
	shim: {
		"vendor/ace/theme-default": {
			deps: ['./ace'],
		},
		"vendor/ace/mode-arduino": {
			deps: ['./ace'],
		},
		"vendor/ace/snippets/text": {
			deps: ['../ace'],
		},
		"vendor/ace/snippets/arduino": {
			deps: ['../ace', './text'],
		},
		"vendor/ace/ext-language_tools": {
			deps: ['./ace', "./theme-default", "./mode-arduino", "./snippets/text", "./snippets/arduino"],
		},
	},
});
require(['./app/app-index'], function(app) {
	app.init();
});
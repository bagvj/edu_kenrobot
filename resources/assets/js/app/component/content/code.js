define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools'], function(_, util, emitor) {
	var editor;
	var region;

	function init() {
		editor = ace.edit("code-container");
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
		});
		editor.setReadOnly(true);
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/default");
		editor.session.setMode("ace/mode/arduino");

		editor.commands.addCommands([{
			name: "saveProject",
			bindKey: {
				win: "Ctrl-S",
				mac: "Command-S"
			},
			exec: function() {}
		}, {
			name: "formatCode",
			bindKey: {
				win: "Ctrl-U",
				mac: "Command-U"
			},
			exec: function() {}
		}, {
			name: "movelinesup",
			bindKey: {
				win: "Ctrl-Up",
				mac: "Command-Up"
			},
			exec: function(e) {
				e.moveLinesUp();
			},
			scrollIntoView: "cursor"
		}, {
			name: "movelinesdown",
			bindKey: {
				win: "Ctrl-Down",
				mac: "Command-Down"
			},
			exec: function(e) {
				e.moveLinesDown();
			},
			scrollIntoView: "cursor"
		}, {
			name: "unfind",
			bindKey: {
				win: "Ctrl-F",
				mac: "Command-F"
			},
			exec: function() {},
		}, {
			name: "unreplace",
			bindKey: {
				win: "Ctrl-H",
				mac: "Command-Option-F"
			},
			exec: function() {},
		}, {
			name: "showSettingsMenu",
			bindKey: {
				win: "Ctrl-,",
				mac: "Command-,"
			},
			exec: function() {},
		}, {
			name: "centerselection",
			bindKey: {
				win: "Ctrl-L",
				mac: "Command-L",
			},
			exec: function() {},
		}]);

		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {
		editor.setValue('/*\n  String Case changes\n Examples of how to change the case of a string\n created 27 July 2010\n modified 2 Apr 2012\n by Tom Igoe\n http://www.arduino.cc/en/Tutorial/StringCaseChanges\n This example code is in the public domain.\n */\nvoid setup() {\n  // Open serial communications and wait for port to open:\n  Serial.begin(9600);\n  while (!Serial) {\n    ; // wait for serial port to connect. Needed for native USB port only\n  }\n  // send an intro:\n  Serial.println("\\n\\nString  case changes:");\n  Serial.println();\n}\nvoid loop() {\n  // toUpperCase() changes all letters to upper case:\n  String stringOne = "<html><head><body>";\n  Serial.println(stringOne);\n  stringOne.toUpperCase();\n  Serial.println(stringOne);\n  // toLowerCase() changes all letters to lower case:\n  String stringTwo = "</BODY></HTML>";\n  Serial.println(stringTwo);\n  stringTwo.toLowerCase();\n  Serial.println(stringTwo);\n  // do nothing while true:\n  while (true);\n}', -1);
	}

	return {
		init: init,
	};
});
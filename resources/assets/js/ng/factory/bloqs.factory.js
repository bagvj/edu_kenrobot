var kenrobot = window.kenrobot = window.kenrobot || {};

'use strict';
(function(bloqsLanguages) {
	var texts = {
		"zh": {
			"bloq-zowi-mouth-tongueOut": "smile with tongue out",
			"bloq-zowi-mouth-confused": "confused face",
			"bloq-zowi-mouth-bigSurprise": "surprised face",
			"bloq-zowi-distance": "Zowi, measure the distance",
			"bloq-zowi-sound": "Zowi, listen carefully",
			"bloq-zowi-sounds-OhOoh": "oh-oh",
			"bloq-zowi-sounds-surprise": "surprise",
			"bloq-zowi-sounds-sad": "sadness",
			"bloq-zowi-sounds-happy": "happiness",
			"bloq-zowi-sounds-sleeping": "sleepiness",
			"bloq-zowi-sounds-cuddly": "cuddle",
			"bloq-zowi-sounds-confused": "confusion",
			"bloq-zowi-movements-shakeLeg": "move leg ",
			"bloq-zowi-sounds-fart1": "fart",
			"bloq-zowi-movements-speed-medium": "medium",
			"bloq-zowi-movements-speed-small": "low",
			"bloq-zowi-movements-speed-high": "high",
			"bloq-break-stopLoop": "Break out of the loop",
			"bloq-code-writeYourCode": "Create your own code",
			"bloq-comment-comment": "Comment //",
			"bloq-convert-convert": "Convert",
			"bloq-convert-to": "to",
			"bloq-convert-dec": "Decimal",
			"bloq-convert-hex": "Hexadecimal",
			"bloq-convert-oct": "Octal",
			"bloq-convert-bin": "Binary",
			"bloq-serial-receiver-receive": "Receive",
			"bloq-serial-send-send": "Send",
			"bloq-serial-send-print": "Without line break",
			"bloq-serial-send-println": "With line break",
			"bloq-buzzer-advance-sound": "Sound the buzzer",
			"bloq-buzzer-advance-note": "with the note",
			"bloq-buzzer-advance-for": "for",
			"bloq-buzzer-advance-ms": "ms",
			"bloq-digital-read-advanced-readpin": "Read digital pin",
			"bloq-analog-read-advanced-readpin": "Read analogue pin",
			"bloq-continuous-servo-start-advanced-turn": "Rotate servo",
			"bloq-continuous-servo-start-advanced-direction": "direction",
			"bloq-continuous-servo-start-advanced-clockwise": "clockwise",
			"bloq-continuous-servo-start-advanced-counterclockwise": "anti-clockwise",
			"bloq-continuous-servo-stop-advanced-stop": "Stop servo",
			"bloq-lcd-turn-on-off-advanced-turnon": "Switch on",
			"bloq-lcd-turn-on-off-advanced-turnoff": "Switch off",
			"bloq-lcd-turn-on-off-advanced-lcdLigth": "the LCD light",
			"bloq-lcd-clear": "Clear content of the LCD",
			"bloq-lcd-writte-advanced-write": "Write",
			"bloq-lcd-writte-advanced-inLCD": "on the LCD",
			"bloq-lcd-writte-advanced-inPosition": "starting at position (column, row)",
			"bloq-led-advanced-turnon": "Switch on",
			"bloq-led-advanced-turnoff": "Switch off",
			"bloq-led-advanced-theLED": "the LED",
			"bloq-oscillator-advanced-oscillate": "Oscillate servo",
			"bloq-oscillator-advanced-around": "around",
			"bloq-oscillator-advanced-amplitude": "with amplitude",
			"bloq-oscillator-advanced-speed": "with speed",
			"bloq-oscillator-start-advanced-oscillator": "Oscillator",
			"bloq-oscillator-stop-advanced-stop": "Stop oscillator",
			"bloq-pin-read-advanced-readpin": "Read the pin",
			"bloq-pin-writte-advanced-writepin": "Write on the pin",
			"bloq-pin-writte-advanced-data": "the data",
			"bloq-read-advanced-read": "Read",
			"bloq-servo-advanced-move": "Move",
			"bloq-servo-advanced-to": "to",
			"bloq-servo-advanced-degrees": "degrees",
			"bloq-buzzer-sound": "Sound the buzzer",
			"bloq-buzzer-note": "with the note",
			"bloq-buzzer-for": "for",
			"bloq-buzzer-ms": "ms",
			"bloq-buzzer-do": "Do",
			"bloq-buzzer-re": "Re",
			"bloq-buzzer-mi": "Mi",
			"bloq-buzzer-fa": "Fa",
			"bloq-buzzer-sol": "Sol",
			"bloq-buzzer-la": "La",
			"bloq-buzzer-si": "Si",
			"bloq-continuous-servo-start-turn": "Rotate servo",
			"bloq-continuous-servo-start-direction": "direction",
			"bloq-continuous-servo-start-clockwise": "clockwise",
			"bloq-continuous-servo-start-counterclockwise": "anti-clockwise",
			"bloq-continuous-servo-stop-stop": "Stop servo",
			"bloq-lcd-turn-on-off-turnon": "Switch on",
			"bloq-lcd-turn-on-off-turnoff": "Switch off",
			"bloq-lcd-turn-on-off-lcdLigth": "the LCD light",
			"bloq-lcd-writte-write": "Write",
			"bloq-lcd-writte-inLCD": "on the LCD",
			"bloq-led-turnon": "Switch on",
			"bloq-led-turnoff": "Switch off",
			"bloq-led-theLED": "the LED",
			"bloq-oscillator-oscillate": "Oscillate servo",
			"bloq-oscillator-around": "around",
			"bloq-oscillator-amplitude": "with amplitude",
			"bloq-oscillator-speed": "with speed",
			"bloq-oscillator-times": "times",
			"bloq-oscillator-start-oscillator": "Start oscillator",
			"bloq-oscillator-stop-stop": "Stop oscillator",
			"bloq-read-read": "Read",
			"bloq-servo-move": "Move",
			"bloq-servo-to": "to",
			"bloq-servo-degrees": "degrees",
			"bloq-case-ifSameTo": "if equal to",
			"bloq-case-exec": "do:",
			"bloq-case-default-inOtherCase": "else, do:",
			"bloq-continue-continue": "Continue with next iteration of the loop",
			"bloq-else-else": "else if, do:",
			"bloq-else-if-if": "else if",
			"bloq-else-if-else": "do:",
			"bloq-for-count": "Count with",
			"bloq-for-from": "from",
			"bloq-for-to": "until",
			"bloq-for-add": "adding",
			"bloq-for-subtract": "subtracting",
			"bloq-for-exec": "do:",
			"bloq-if-if": "If",
			"bloq-if-exec": "do:",
			"bloq-switch-check": "Check the value of",
			"bloq-wait-wait": "Wait",
			"bloq-while-while": "While",
			"bloq-while-exec": "do:",
			"bloq-argument-var": "Variable",
			"bloq-argument-float": "Decimal",
			"bloq-argument-string": "Text",
			"bloq-argument-bool": "Boolean",
			"bloq-invoke-function-exec": "Do",
			"bloq-invoke-return-function-exec": "Do",
			"bloq-invoke-function-args": "with the following parameters:",
			"bloq-return-return": "Return",
			"bloq-return-function-declare": "Declare function",
			"bloq-return-function-return": "Return",
			"bloq-return-function-with-arguments-declare": "Declare function",
			"bloq-return-function-with-arguments-count": "counting with",
			"bloq-return-function-with-arguments-return": "Return",
			"bloq-void-function-declare": "Declare function",
			"bloq-void-function-with-arguments-declare": "Declare function",
			"bloq-void-function-with-arguments-count": "counting with",
			"bloq-boolArray-advanced-arraySize": "Array with size",
			"bloq-boolArray-advanced-boolType": "and bool type",
			"bloq-boolArray-arraySize": "Array with size",
			"bloq-boolArray-boolType": "and bool type",
			"bloq-boolean-true": "True",
			"bloq-boolean-false": "False",
			"bloq-logic-operations-and": "and",
			"bloq-logic-operations-or": "or",
			"bloq-not-not": "not",
			"bloq-loop-header": "Loop",
			"bloq-loop-description": "这里就是程序一直在做的事情，记得是无循环哦",
			"bloq-setup-header": "Setup",
			"bloq-setup-description": "什么事情需要程序开始时只做一遍，放在这里面吧",
			"bloq-var-header": "全局变量、函数和类",
			"bloq-var-description": "如果你有变量需要在setup和loop里面同时使用，要在这里定义哦<br />如果你需要定义函数或类，要在这里定义哦",
			"bloq-numberArray-advanced-arraySize": "Array with size",
			"bloq-numberArray-advanced-type": "and type",
			"bloq-numberArray-advanced-float": "decimal",
			"bloq-numberArray-advanced-int": "whole",
			"bloq-map-map": "Map",
			"bloq-map-value": "value between [0-",
			"bloq-map-advanced-map": "Map",
			"bloq-map-advanced-value": "from [",
			"bloq-map-advanced-and": "] to [",
			"bloq-math-operations-sqrt": "Square root",
			"bloq-math-operations-abs": "Absolute value",
			"bloq-numberArray-arraySize": "Array with size",
			"bloq-numberArray-floatType": " and float type",
			"bloq-random-random": "Random between",
			"bloq-random-and": "and",
			"bloq-stringArray-advanced-arraySize": "Array with size",
			"bloq-stringArray-advanced-type": "and type",
			"bloq-stringArray-advanced-string": "String",
			"bloq-stringArray-advanced-char": "Char",
			"bloq-length-length": "Length",
			"bloq-string-string": "Text",
			"bloq-stringArray-arraySize": "Array with size",
			"bloq-stringArray-stringType": "and text type",
			"bloq-string-create-create": "Create text with",
			"bloq-hw-variable-advanced-variable": "Variable (components)",
			"bloq-sw-variable-advanced-variable": "Variable (components)",
			"bloq-array-variable-variable": "Variable",
			"bloq-declare-variable-declare": "Declare variable",
			"bloq-declare-variable-declare-type": "with type",
			"bloq-declare-variable-declare-type-int": "whole",
			"bloq-declare-variable-declare-type-float": "decimal",
			"bloq-declare-variable-declare-type-text": "text",
			"bloq-declare-variable-declare-type-char": "character",
			"bloq-declare-variable-declare-type-bool": "boolean",
			"bloq-select-variable-variable": "Variable",
			"bloq-set-variableArray-variable": "Variable",
			"bloq-set-variable-variable": "Variable",
			"bloq-char": "Character",
			"bloq-lcd-default": "Hi!",
			"bloq-comment-default": "Type a comment",
			"bloq-functions-default": "Name",
			"bloq-wait-ms": "ms",
			"drag-bloq": "拖一个BLOCK放到这里开始你第一个程序吧",
			"bloq-invoke-class-function-class": "of the object",
			"bloq-invoke-arguments-class": "Create an object of the class",
			"bloq-invoke-arguments-class-name": "with the name",
			"bloq-invoke-arguments-args": "with the following arguments",
			"bloq-invoke-class-return-function-exec": "Execute the function",
			"bloq-invoke-class-function-exec": "Execute the function",
			"bloq-invoke-class-function-args": "with the following arguments",
			"bloq-invoke-class-return-function-args-exec": "Execute the function",
			"bloq-invoke-class-return-function-args-class": "of the object",
			"bloq-invoke-class-return-function-args-args": "with the following arguments",
			"bloq-set-class-variable-variable": "Variable",
			"bloq-set-class-variableArray-variable": "Variable",
			"bloq-select-class-variable-variable": "Variable",
			"bloq-array-class-variable-variable": "Variable",
			"bloq-constructor": "Constructor",
			"bloq-constructor-arguments": "Constructor that uses the following arguments",
			"bloq-invoke-class": "Create an object of the class",
			"bloq-invoke-class-name": "with the name",
			"bloq-class": "Declare the class",
			"bloq-class-default": "Name",
			"bloq-class-from": "of",
			"bloq-class-inheritance-type": "inherit ",
			"bloq-class-inheritance-public": "public",
			"bloq-class-inheritance-protected": "protected",
			"bloq-class-inheritance-private": "private",
			"bloq-public": "Public variables and functions:",
			"bloq-protected": "Protected variables and functions:",
			"bloq-private": "Private variables and functions:",
			"bloq-include-lib-exec": "Include the library",
			"bloq-pin-analog-write": "Write on the analogue pin",
			"bloq-pin-digital-write": "Write on the digital pin",
			"bloq-pin-analog-write-data": "the data",
			"bloq-pin-digital-write-data": "the data",
			"bloq-zowi-movements": "Zowi:",
			"bloq-zowi-movements-walk": "walk",
			"bloq-zowi-movements-turn": "turn",
			"bloq-zowi-movements-height-moonwalker": "moonwalk",
			"bloq-zowi-movements-height-crusaito": "cross-step",
			"bloq-zowi-movements-height-flapping": "flap",
			"bloq-zowi-movements-shakeleg": "shake your legs",
			"bloq-zowi-movements-bend": "bend",
			"bloq-zowi-movements-forward": "forward",
			"bloq-zowi-movements-backward": "backward",
			"bloq-zowi-movements-left": "left",
			"bloq-zowi-movements-right": "right",
			"bloq-zowi-movements-speed": "steps with a",
			"bloq-zowi-mouth": "Zowi, draw a",
			"bloq-zowi-mouth-mouth": "on your mouth",
			"bloq-zowi-mouth-smile": "smile",
			"bloq-zowi-mouth-sad": "sad face",
			"bloq-zowi-mouth-happy": "happy face",
			"bloq-zowi-movements-height": "Zowi,",
			"bloq-zowi-movements-height-forward": "forward",
			"bloq-zowi-movements-height-backward": "backward",
			"bloq-zowi-movements-height-left": "left",
			"bloq-zowi-movements-height-right": "right",
			"bloq-zowi-movements-height-speed": "times with a",
			"bloq-zowi-movements-height-height": "speed and a",
			"bloq-zowi-movements-height-big": "high",
			"bloq-zowi-movements-height-medium": "medium",
			"bloq-zowi-movements-height-small": "low",
			"bloq-zowi-movements-no-dir": "Zowi,",
			"bloq-zowi-movements-no-dir-updown": "go up and down",
			"bloq-zowi-movements-no-dir-swing": "swing",
			"bloq-zowi-movements-no-dir-tiptoeSwing": "swing on tiptoes",
			"bloq-zowi-movements-no-dir-jitter": "jitter",
			"bloq-zowi-movements-no-dir-ascendingTurn": "ascending turn",
			"bloq-zowi-movements-no-dir-jump": "jump",
			"bloq-zowi-movements-no-dir-speed": "times with a",
			"bloq-zowi-movements-no-dir-height": "speed and a",
			"bloq-zowi-movements-no-dir-big": "high",
			"bloq-zowi-movements-no-dir-medium": "medium",
			"bloq-zowi-movements-no-dir-small": "low",
			"bloq-zowi-sounds": "Zowi, make this sound:",
			"bloq-hts221-humidity": "Read humidity of the sensor",
			"bloq-hts221-temperature": "Read temperature of the sensor",
			"bloq-rgbLed-fade-red": "with a red value of",
			"bloq-enable-interrupt": "Execute the function",
			"bloq-enable-interrupt-rising": "change from 0 to 1",
			"bloq-enable-interrupt-falling": "change from 1 to 0",
			"bloq-enable-interrupt-change": "change",
			"bloq-enable-interrupt-pin": "when the pin input",
			"bloq-rgbLed-green": ", a green value of",
			"bloq-rgbLed-fade": "Create a gradient on the RBG LED",
			"bloq-rgbLed-red": "with a red value of",
			"bloq-rtc-init": "Update time and date of the clock",
			"bloq-rtc-month": "month",
			"bloq-rtc-using-advanced": "currently used by clock",
			"bloq-rtc-year": "year",
			"bloq-rtc-day": "day",
			"bloq-rtc-hour": "hour",
			"bloq-rtc-minute": "minute",
			"bloq-rtc-second": "second",
			"bloq-rtc-time": "hour",
			"bloq-rtc-using": "currently used by clock",
			"bloq-rtc-advanced": "Get",
			"bloq-rtc": "Get the",
			"default-var-name-rtc": "real_time_clock",
			"bloq-rtc-date": "date",
			"default-var-name-sound": "sound_sensor",
			"bloq-rgbLed-blue": "and a blue value of",
			"default-var-name-RGBled": "RGB_LED",
			"bloq-rgbLed": "Light up the RGB LED",
			"bloq-rgbLed-fade-blue": "and a blue value of",
			"bloq-rgbLed-fade-green": ", a green value of",
			"bloq-rgbLed-simple": "Light up the RGB LED",
			"bloq-rgbLed-simple-color": "in",
			"bloq-rgbLed-simple-red": "red",
			"bloq-rgbLed-simple-green": "green",
			"bloq-rgbLed-simple-blue": "blue",
			"bloq-zowi-gestures": "Zowi, show",
			"bloq-zowi-gestures-ZowiHappy": "happy",
			"bloq-zowi-gestures-ZowiSuperHappy": "super happy",
			"bloq-zowi-gestures-ZowiSad": "sad",
			"bloq-zowi-gestures-ZowiSleeping": "sleepy",
			"bloq-zowi-gestures-ZowiFart": "fart",
			"bloq-zowi-gestures-ZowiConfused": "confused",
			"bloq-zowi-gestures-ZowiLove": "in love",
			"bloq-zowi-gestures-ZowiAngry": "angry",
			"bloq-zowi-gestures-ZowiFretful": "anxious",
			"bloq-zowi-gestures-ZowiMagic": "magic",
			"bloq-zowi-gestures-ZowiWave": "wave",
			"bloq-zowi-gestures-ZowiVictory": "victory",
			"bloq-zowi-gestures-ZowiFail": "defeat",
			"bloq-zowi-movements-simple": "Zowi,",
			"bloq-zowi-movements-simple-steps": "times",
			"bloq-zowi-movements-simple-walk": "walk",
			"bloq-zowi-movements-simple-turn": "turn",
			"bloq-zowi-movements-simple-shakeLeg": "move leg",
			"bloq-zowi-movements-simple-bend": "bend",
			"bloq-zowi-movements-simple-moonwalker": "moonwalk",
			"bloq-zowi-movements-simple-crusaito": "cross-step",
			"bloq-zowi-movements-simple-flapping": "flap",
			"bloq-zowi-movements-simple-updown": "go up and down",
			"bloq-zowi-movements-simple-swing": "swing",
			"bloq-zowi-movements-simple-tiptoeSwing": "swing on tiptoes",
			"bloq-zowi-movements-simple-jitter": "jitter",
			"bloq-zowi-movements-simple-ascendingTurn": "ascending turn",
			"bloq-zowi-movements-simple-jump": "jump",
			"bloq-zowi-rest": "Zowi, rest",
			"bloq-millis": "Get execution time",
			"bloq-random-seed": "Start random number generator",
			"bloq-rgbLed-simple-white": "white",
			"bloq-rgbLed-simple-yellow": "yellow",
			"bloq-rgbLed-simple-orange": "orange",
			"bloq-rgbLed-simple-dark-green": "dark green",
			"bloq-rgbLed-simple-dark-blue": "dark blue",
			"bloq-rgbLed-simple-pink": "pink",
			"bloq-argument-int": "Integer",
			"bloq-argument-char": "Character",
			"bloq-zowi-buttons": "button",
			"bloq-zowi-buttons-A": "A",
			"bloq-zowi-buttons-B": "B",
			"bloq-zowi-if-distance": "If it detects a distance",
			"bloq-zowi-if-distance-less": "of less",
			"bloq-zowi-if-distance-more": "of more",
			"bloq-zowi-if-distance-than": "than",
			"bloq-zowi-if-distance-then": "centimetres, it will do this:",
			"bloq-zowi-if-buttons": "If the I press button",
			"bloq-zowi-if-buttons-A": "A",
			"bloq-zowi-if-buttons-B": "B",
			"bloq-zowi-if-buttons-then": ", do:",
			"bloq-zowi-if-sound": "If it hears a noise, it will do this:",
			"bloq-evolution-rest": "Rest",
			"bloq-evolution-movements-simple": "Move",
			"bloq-evolution-movements-simple-fordward": "forward",
			"bloq-evolution-movements-simple-backward": "backward",
			"bloq-evolution-movements-simple-right": "right",
			"bloq-evolution-movements-simple-left": "left",
			"bloq-evolution-distance": "Measure the distance",
			"bloq-evolution-if-distance": "If it detects a distance",
			"bloq-evolution-if-distance-less": "of less",
			"bloq-evolution-if-distance-more": "of more",
			"bloq-evolution-if-distance-than": "than",
			"bloq-evolution-if-distance-then": "centimetres, it will do this:",
			"bloq-evolution-light": "Measure the light",
			"bloq-evolution-light-left": "left",
			"bloq-evolution-light-right": "right",
			"bloq-evolution-line": "Detect the line",
			"bloq-evolution-line-left": "left",
			"bloq-evolution-line-right": "right",
			"bloq-evolution-head": "Look",
			"bloq-evolution-head-left": "left",
			"bloq-evolution-head-right": "right",
			"bloq-evolution-head-center": "forward",
			"bloq-evolution-buzzer-do": "Do",
			"bloq-evolution-buzzer": "Touch the note",
			"bloq-evolution-buzzer-re": "Re",
			"bloq-evolution-buzzer-mi": "Mi",
			"bloq-evolution-buzzer-fa": "Fa",
			"bloq-evolution-buzzer-sol": "Sol",
			"bloq-evolution-buzzer-la": "La",
			"bloq-evolution-buzzer-si": "Si",
			"bloq-evolution-buzzer-for": "for",
			"bloq-evolution-buzzer-ms": "ms",
			"bloq-evolution-head-advance": "Look",
			"bloq-evolution-head-advance-deg": "degrees",
			"bloq-evolution-head-advance-left": "left",
			"bloq-evolution-head-advance-right": "right",
			"bloq-shield-stepper-steps": "Turn the stepper motor",
			"bloq-shield-stepper-steps-stepper1": "1",
			"bloq-shield-stepper-steps-stepper2": "2",
			"bloq-shield-stepper-steps-stepper12": "1 and 2",
			"bloq-shield-stepper-steps-degdir": "degrees",
			"bloq-shield-stepper-steps-CW": "clockwise",
			"bloq-shield-stepper-steps-CCW": "anti-clockwise",
			"bloq-shield-stepper-steps-at": "at",
			"bloq-shield-stepper-steps-rpm": "rpm",
			"bloq-evolution-if-line": "If the line detected is",
			"bloq-evolution-if-line-white": "white",
			"bloq-evolution-if-line-black": "black",
			"bloq-evolution-if-line-and": "on the left and",
			"bloq-evolution-if-line-then": "on the right, it will do this:",
			"bloq-evolution-if-light-advanced": "If it sees light",
			"bloq-evolution-if-light-advanced-and": "on the left and",
			"bloq-evolution-if-light-advanced-then": "on the right, it will do this:",
			"bloq-evolution-if-light": "If it sees light",
			"bloq-evolution-if-light-and": "on the left and",
			"bloq-evolution-if-light-then": "on the right, it will do this:",
			"bloq-evolution-if-light-high": "high",
			"bloq-evolution-if-light-medium": "medium",
			"bloq-evolution-if-light-low": "low",
			"bloq-zowi-movements-endtext": "speed",
			"bloq-zowi-movements-height-endtext": "height",
			"bloq-zowi-movements-no-dir-endtext": "height",
			"bloq-zowi-if-buttons-then-v1": ", do:",
			"bloq-zowi-if-distance-then-v1": "cm, do:",
			"bloq-zowi-if-sound-v1": "If Zowi hears a sound, do:",
			"bloq-num-conversion": "convert",
			"bloq-num-conversion-to": "to",
			"bloq-num-conversion-int": "integer",
			"bloq-num-conversion-float": "decimal"
		}
	};
	bloqsLanguages.texts = texts;
	return bloqsLanguages;
})(kenrobot.bloqsLanguages = kenrobot.bloqsLanguages || {}, undefined);

'use strict';
(function(bloqsUtils, _) {
	var isNumeric = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	/**
	 * If the param is not a number, we set it to ''
	 * @param  number
	 */

	var validNumber = function(number) {
		var temp = number;
		var removedChar = 0;
		var i = 0;
		if (number[0] === '-') {
			temp = number.substring(1);
			i = 1;
		}
		// var count = occurrencesInString(number, '.', false);
		var index = number.indexOf('.');
		while (i < number.length) {
			if ((number[i] === '.' && index < i) || (!isNumeric(number[i]) && number[i] !== '.')) {
				number = number.slice(0, i) + number.slice(i + 1, number.length);
				removedChar += 1;
			} else {
				i++;
			}
		}

		return {
			value: number,
			removedChar: removedChar
		};
	};

	var getCaretPosition = function(el) {
		if (el.selectionStart) {
			return el.selectionStart;
		} else if (document.selection) {
			el.focus();

			var r = document.selection.createRange();
			if (r === null) {
				return 0;
			}

			var re = el.createTextRange(),
				rc = re.duplicate();
			re.moveToBookmark(r.getBookmark());
			rc.setEndPoint('EndToStart', re);

			return rc.text.length;
		}
		return 0;
	};

	var setCaretPosition = function(ctrl, pos) {
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		} else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	/**
	 * If the param has non escaped characters, escape them
	 * @param  value
	 */
	var validString = function(value) {
		value = value.replace(/(^|\b|[^\\])(\\\\)*\\$/g, '$&\\');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\")/g, '$1\\$2');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\/\*)/g, '$1\\$2');
		value = value.replace(/(^|\b|[^\\])((\\\\)*\/\/)/g, '$1\\$2');
		value = value.replace(/\$\'/g, '\$\\\'');
		value = value.replace(/\$\&/g, '\$\\\&');

		return value;
	};

	/**
	 * Return the first valid char from a string
	 * @param  value
	 */
	var validChar = function(value) {
		value = value.replace(/\$*/g, '');
		if (/^\\/g.test(value)) {
			if (/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g.test(value)) {
				value = value.match(/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g)[0];
			} else if (/^\\[bfnrtv0']/g.test(value)) {
				value = value.substring(0, 2);
			} else if (/^\\[%#!|"@~&?\/()=^`[+\]*,{};.:-]/g.test(value)) {
				value = value.charAt(1);
			} else {
				value = '\\\\';
			}
		} else if (/^(\')/g.test(value)) {
			value = '\\\'';
		} else {
			value = value.charAt(0);
		}

		return value;
	};

	/**
	 * If the param has a comment end, omit it
	 * @param  value
	 */
	var validComment = function(value) {
		value = value.replace(/\*\//g, '');
		value = value.replace(/\$\'/g, '\$\\\'');
		value = value.replace(/\$\&/g, '\$\\\&');

		return value;
	};

	/**
	 * Transform a function or variable name to make it "legal" in Arduino coding language
	 * @param  name
	 */
	var validName = function(name, softwareArrays) {
		var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
		reservedWords = reservedWords.split(',');
		if (name && name.length > 0) {
			var i = 0,
				j = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}

			i = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}
			for (j = 0; j < reservedWords.length; j++) {
				if (name === reservedWords[j]) {
					name += '_';
					break;
				}
			}
			var counter = [];
			if (softwareArrays) {
				var softwareVars = softwareArrays.softwareVars.concat(softwareArrays.voidFunctions, softwareArrays.returnFunctions);
				for (j = 0; j < softwareVars.length; j++) {
					if (name === softwareVars[j].name) {
						counter.push(j);

					}
				}
				if (counter.length === 2) {
					j = counter[1];
					//console.log('name === softwareVars[j].name', name === softwareVars[j].name, name, softwareVars[j].name);
					if (isNaN(name[name.length - 1])) {
						name += '1';
					} else {
						i = 0;
						var number, it;
						while (isNaN(name[i])) {
							it = i;
							i++;
						}
						number = parseInt(name.substring(it + 1, name.length), 10);
						number += 1;
						name = name.substring(0, it + 1);
						name += number.toString();
					}
				}
			}
		}
		return name;
	};

	var appendArrayInOneTime = function($container, $items) {
		var rawArray = $.map(
			$items,
			function(value) {

				return (value.get());

			}
		);

		// Add the raw DOM array to the current collection.
		$container.append(rawArray);
	};

	var generateUUID = function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};
	var getNumericStyleProperty = function(style, prop) {
		return parseInt(style.getPropertyValue(prop), 10);
	};

	var drawDropdownOptions = function($element, arrayOptions) {
		var $tempElement, i,
			$items = [];

		$element.html('');
		for (i = 0; i < arrayOptions.length; i++) {
			$tempElement = $('<option>').attr({
				'data-var-id': arrayOptions[i].id,
				value: arrayOptions[i].name,
				'data-reference': arrayOptions[i].uid
			}).html(arrayOptions[i].name);
			$items.push($tempElement);
		}
		appendArrayInOneTime($element, $items);
	};

	var itsOver = function(dragConnector, dropConnector, margin) {
		margin = margin || 0;
		var dragConnectorOffset = dragConnector.offset(),
			dropConnectorOffset = dropConnector.offset();
		return dragConnectorOffset.left < (dropConnectorOffset.left + dropConnector[0].clientWidth + margin) && (dragConnectorOffset.left + dragConnector[0].clientWidth) > (dropConnectorOffset.left - margin) && dragConnectorOffset.top < (dropConnectorOffset.top + dropConnector[0].clientHeight + margin) && (dragConnectorOffset.top + dragConnector[0].clientHeight) > (dropConnectorOffset.top - margin);
	};

	var sameConnectionType = function(dragBloq, dropBloq, dropConnectorAcceptType, bloqs, IOConnectors, softwareArrays) {
		var dragConnectorType = getTypeFromBloq(dragBloq, bloqs, IOConnectors, softwareArrays);
		if (typeof(dropConnectorAcceptType) === 'object') {
			dropConnectorAcceptType = getTypeFromDynamicDropdown(dropBloq, dropConnectorAcceptType, softwareArrays);
		}
		return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
	};

	var getTypeFromDynamicDropdown = function(bloq, typeObject, softwareArrays) {
		var attributeValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').attr('data-value');
		var selectedValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').val();
		var selectedVarNameOnDropdown = attributeValue || selectedValue;

		var varData = _.find(softwareArrays[typeObject.options], {
			name: selectedVarNameOnDropdown
		});
		if (varData) {
			if (typeObject.pointer) {
				varData.type = varData.type.replace(' *', '');
			}
			return varData.type;
		}
		return '';

	};
	var getFromDynamicDropdownType = function(bloq, idDropdown, options, softwareArrays, componentsArray) {
		var attributeValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
		var selectedValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').val();
		var varName = attributeValue || selectedValue;

		var softVar = _.find(softwareArrays[options], {
			name: varName
		});
		if (!softVar) {
			for (var j in componentsArray.sensors) {
				if (componentsArray.sensors[j].name === varName) {
					if (componentsArray.sensors[j].type === 'Joystick' || componentsArray.sensors[j].type === 'LineFollower') {
						return 'float *';
					} else if (componentsArray.sensors[j].type === 'ButtonPad') {
						return 'char';
					} else {
						return 'float';
					}
				}
			}
		}
		if (softVar) {
			if (bloq.bloqData && bloq.bloqData.returnType && bloq.bloqData.returnType.pointer) {
				softVar.type = softVar.type.replace(' *', '');
			}
			return softVar.type;
		}
		return '';
	};

	var getTreeExtreme = function(bloqUuid, bloqs, connectors, connectorPosition) {
		if (connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo) {
			return getTreeExtreme(connectors[connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo].bloqUuid, bloqs, connectors, connectorPosition);
		} else {
			return bloqs[bloqUuid].connectors[connectorPosition];
		}
	};

	var getLastBottomConnectorUuid = function(bloqUuid, bloqs, connectors) {
		return getTreeExtreme(bloqUuid, bloqs, connectors, 1);
	};

	var getFirstTopConnectorUuid = function(bloqUuid, bloqs, connectors) {
		return getTreeExtreme(bloqUuid, bloqs, connectors, 0);
	};

	var getOutputConnector = function(bloq, IOConnectors) {
		var i = 0,
			outputConnector = null;
		while (!outputConnector && (i < bloq.IOConnectors.length)) {
			if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--output') {
				outputConnector = IOConnectors[bloq.IOConnectors[i]];
			}
			i++;
		}
		if (!outputConnector) {
			throw 'outputBloq has no connector-output';
		} else {
			return outputConnector;
		}
	};

	var getNodesHeight = function(bloqUuid, bloqIsTop, bloqs, connectors) {
		var bloq = bloqs[bloqUuid];
		var connectorPosition;
		if (bloqIsTop) {
			connectorPosition = 1;
		} else {
			connectorPosition = 0;
		}
		if (connectors[bloq.connectors[connectorPosition]].connectedTo) {
			return bloq.$bloq.outerHeight(true) + getNodesHeight(connectors[connectors[bloq.connectors[connectorPosition]].connectedTo].bloqUuid, bloqIsTop, bloqs, connectors);
		} else {
			return bloq.$bloq.outerHeight(true);
		}
	};

	var getTreeHeight = function(bloqUuid, bloqs, connectors) {
		var bloq = bloqs[bloqUuid];
		var topConnectorUuid = connectors[bloq.connectors[0]].connectedTo,
			bottomConnectorUuid = connectors[bloq.connectors[1]].connectedTo;
		var height = bloq.$bloq.outerHeight(true);
		if (topConnectorUuid) {
			height += getNodesHeight(connectors[topConnectorUuid].bloqUuid, false, bloqs, connectors);
		}
		if (bottomConnectorUuid) {
			height += getNodesHeight(connectors[bottomConnectorUuid].bloqUuid, true, bloqs, connectors);
		}
		return height;
	};

	var drawBranch = function(bloqs, connectors, topConnectorUuid) {
		var branchUuid = connectors[topConnectorUuid].bloqUuid;
		//console.log('          ******* - branch - *********', branchUuid);
		//console.log('          connector--top:', bloqs[branchUuid].connectors[0], 'connectedTo', connectors[bloqs[branchUuid].connectors[0]].connectedTo);
		//console.log('          connector--bottom:', bloqs[branchUuid].connectors[1], 'connectedTo', connectors[bloqs[branchUuid].connectors[1]].connectedTo);
		if (bloqs[branchUuid].connectors[2]) {
			//console.log('       connector--root:', bloqs[branchUuid].connectors[2], 'connectedTo', connectors[bloqs[branchUuid].connectors[2]].connectedTo);
			//console.log('                       ******* -  content **********');
			if (connectors[bloqs[branchUuid].connectors[2]].connectedTo) {
				drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[2]].connectedTo);
			}
			//console.log('                       ******* - end content **********');
		}
		if (connectors[bloqs[branchUuid].connectors[1]].connectedTo) {
			drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[1]].connectedTo);
		}
	};

	var drawTree = function(bloqs, connectors) {
		//console.log('drawtree');
		//buscamos los tipo statement q no tienen un top conectado
		for (var uuid in bloqs) {
			//console.log(bloqs[uuid]);
			if (bloqs[uuid].droppable && bloqs[uuid].connectors[0] && !connectors[bloqs[uuid].connectors[0]].connectedTo) {
				switch (bloqs[uuid].bloqData.type) {
					case 'statement':
					case 'statement-input':
						//console.log('******* - tree - *********', uuid);
						//console.log('connector--top:', bloqs[uuid].connectors[0], 'connectedTo', connectors[bloqs[uuid].connectors[0]].connectedTo);
						//console.log('connector--bottom:', bloqs[uuid].connectors[1], 'connectedTo', connectors[bloqs[uuid].connectors[1]].connectedTo);
						if (bloqs[uuid].connectors[2]) {
							//console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
							//console.log('           ccccccc -  content ccccccc');
							if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
								drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
							}
							//console.log('           ccccccc - end content ccccccc');
						}
						if (connectors[bloqs[uuid].connectors[1]].connectedTo) {
							drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[1]].connectedTo);
						}
						break;
					case 'group':
						//console.log('******* - Group - *********', uuid);
						//console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
						//console.log('           ccccccc -  content ccccccc');
						if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
							drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
						}
						//console.log('           ccccccc - end content ccccccc');
						break;
				}
			}
		}
	};

	var getBranchsConnectors = function(bloqUuid, bloqs, connectors) {
		var bloq = bloqs[bloqUuid];
		var result = [];
		result = result.concat(bloq.connectors);
		//console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
		if (connectors[bloq.connectors[1]].connectedTo) {
			var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
			result = result.concat(getBranchsConnectors(bloqBranchUuid, connectors, bloqs));
		}
		//si tiene hijos
		if (bloq.connectors[2] && connectors[bloq.connectors[2]].connectedTo) {
			var bloqChildUuid = connectors[connectors[bloq.connectors[2]].connectedTo].bloqUuid;
			result = result.concat(getBranchsConnectors(bloqChildUuid, connectors, bloqs));
		}
		return result;
	};
	var getBranchsConnectorsNoChildren = function(bloqUuid, connectors, bloqs) {
		var bloq = bloqs[bloqUuid];
		var result = [];
		result = result.concat(bloq.connectors);
		//console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
		if (connectors[bloq.connectors[1]].connectedTo) {
			var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
			result = result.concat(getBranchsConnectorsNoChildren(bloqBranchUuid, connectors, bloqs));
		}
		return result;
	};

	var getConnectorsUuidByAcceptType = function(IOConnectors, type) {
		var result = [];
		for (var key in IOConnectors) {
			if (IOConnectors[key].data.acceptType === type) {
				result.push(IOConnectors[key].uuid);
			}
		}
		return result;
	};
	var getNotConnected = function(IOConnectors, uuids) {
		var result = [];
		for (var i = 0; i < uuids.length; i++) {
			if (!IOConnectors[uuids[i]].connectedTo) {
				result.push(uuids[i]);
			}
		}
		return result;
	};
	var getInputsConnectorsFromBloq = function(IOConnectors, bloqs, bloq) {
		var result = [];
		var uuid;
		// connectedBloq;
		for (var i = 0; i < bloq.IOConnectors.length; i++) {
			uuid = bloq.IOConnectors[i];
			if (IOConnectors[bloq.IOConnectors[i]] && IOConnectors[uuid].data.type === 'connector--input') {
				result.push(uuid);
			}
		}
		return result;
	};

	var removeInputsConnectorsFromBloq = function(IOConnectors, bloq) {
		//remove visually all bloqInputs
		bloq.$contentContainer.children('.bloqinput').remove();
		bloq.$contentContainer.children('.removabletext').remove();
		//remove all IOConnectors
		for (var i = 0; i < bloq.IOConnectors.length; i++) {
			if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--input') {
				delete IOConnectors[bloq.IOConnectors[i]];
			}
		}
	};
	var generateBloqInputConnectors = function(bloq) {
		var uuid;
		for (var i = 0; i < bloq.content.length; i++) {
			for (var j = 0; j < bloq.content[i].length; j++) {
				if (bloq.content[i][j].alias === 'bloqInput') {
					uuid = generateUUID();
					bloq.content[i][j].name = uuid;
					bloq.connectors.push({
						type: 'connector--input',
						accept: 'connector--output',
						name: uuid
					});
				}
			}
		}
	};
	var getBloqByConnectorUuid = function(connectorUuid, bloqs, connectors) {
		return bloqs[connectors[connectorUuid].bloqUuid];
	};

	var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
	var redrawTree = function(bloq, bloqs, connectors) {
		var rootBloq = getBloqByConnectorUuid(getFirstTopConnectorUuid(bloq.uuid, bloqs, connectors), bloqs, connectors);

		var somethingConnectedInBottomUuid = connectors[rootBloq.connectors[1]].connectedTo,
			transformProperties = translateRegExp.exec(rootBloq.$bloq[0].style.transform),
			top,
			left,
			branchBloq;

		if (transformProperties) {
			top = parseInt(transformProperties[4]);
			left = transformProperties[1];
		} else {
			top = parseInt(rootBloq.$bloq[0].style.top) || rootBloq.$bloq.position().top;
			left = parseInt(rootBloq.$bloq[0].style.left) || rootBloq.$bloq.position().left;
		}
		top += rootBloq.$bloq.outerHeight(true);

		while (somethingConnectedInBottomUuid) {
			branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
			branchBloq.$bloq[0].style.transform = 'translate(' + left + 'px,' + top + 'px)';
			top += branchBloq.$bloq.outerHeight(true);
			somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;
		}

	};

	var itsARootConnector = function(connector) {
		return connector.data.type === 'connector--root';
	};

	var itsInsideAConnectorRoot = function(bloq, bloqs, connectors) {

		var topConnector = connectors[bloq.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			return itsARootConnector(connectedWithTopConnector) || itsInsideAConnectorRoot(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);

		} else {
			return false;
		}
	};

	var getClassName = function(bloq, bloqs, connectors) {
		var topConnector = connectors[bloq.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			var bloqConnected = getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors);
			if (itsARootConnector(connectedWithTopConnector) && (bloqConnected.bloqData.name === 'classChildren' || bloqConnected.bloqData.name === 'class')) {
				return bloqConnected.$bloq.find('[data-content-id="NAME"]').val();
			} else {
				return getClassName(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);
			}
		} else {
			return undefined;
		}
	};

	var jqueryObjectsArrayToHtmlToInsert = function(arrayToTransform) {
		var rawArray = $.map(
			arrayToTransform,
			function(value) {

				// Return the unwrapped version. This will return
				// the underlying DOM nodes contained within each
				// jQuery value.
				return (value.get());

			}
		);
		return rawArray;
	};

	var connectorIsInBranch = function(connectorUuid, topBloqUuid, bloqs, connectors) {
		var isInBloq = false;
		var i = 0;
		//miro si es uno de mis conectores
		while (!isInBloq && (i < bloqs[topBloqUuid].connectors.length)) {
			if (bloqs[topBloqUuid].connectors[i] === connectorUuid) {
				isInBloq = true;
			} else {
				i++;
			}
		}
		i = 0;
		while (!isInBloq && (i < bloqs[topBloqUuid].IOConnectors.length)) {
			if (bloqs[topBloqUuid].IOConnectors[i] === connectorUuid) {
				isInBloq = true;
			} else {
				i++;
			}
		}
		//si tengo hijos miro en ellos
		if (!isInBloq && bloqs[topBloqUuid].connectors[2] && connectors[bloqs[topBloqUuid].connectors[2]].connectedTo) {
			isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[2]].connectedTo].bloqUuid, bloqs, connectors);
		}
		//si tengo enganchado algo abajo miro en ellos
		if (!isInBloq && bloqs[topBloqUuid].connectors[1] && connectors[bloqs[topBloqUuid].connectors[1]].connectedTo) {
			isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[1]].connectedTo].bloqUuid, bloqs, connectors);
		}
		return isInBloq;
	};

	var hasClass = function(el, selector) {
		var className = ' ' + selector + ' ';

		if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
			return true;
		}

		return false;
	};

	var getTypeFromBloq = function(bloq, bloqs, IOConnectors, softwareArrays) {
		var result;
		if (!bloq) {
			console.error('We cant get the type if we dont have a bloq');
		}
		if (!bloq.bloqData.returnType) {
			console.error('we cant get the type from a bloq without returnType ' + bloq.bloqData.name);
		}
		switch (bloq.bloqData.returnType.type) {
			case 'simple':
				result = bloq.bloqData.returnType.value;
				break;
			case 'fromInput':
				var contentData = _.find(bloq.bloqData.content[0], {
					bloqInputId: bloq.bloqData.returnType.bloqInputId
				});
				var connector = _.find(IOConnectors, {
					bloqUuid: bloq.uuid,
					data: {
						name: contentData.name
					}
				});
				if (connector && connector.connectedTo) {
					result = getTypeFromBloq(getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors), bloqs, IOConnectors, softwareArrays);
				} else {
					result = '';
				}
				break;
			case 'fromDynamicDropdown':
				result = getFromDynamicDropdownType(bloq, bloq.bloqData.returnType.idDropdown, bloq.bloqData.returnType.options, softwareArrays, bloq.componentsArray);
				break;
			case 'fromDropdown':
				result = bloq.$bloq.find('[data-content-id="' + bloq.bloqData.returnType.idDropdown + '"]').val();
				break;
			default:
				throw 'we cant get the type from this bloq: ' + bloq.bloqData.name + ' ' + JSON.stringify(bloq.bloqData.returnType);
		}
		return result;
	};
	var occurrencesInString = function(string, subString, allowOverlapping) {
		string += '';
		subString += '';
		if (subString.length <= 0) {
			return string.length + 1;
		}

		var n = 0,
			pos = 0;
		var step = (allowOverlapping) ? (1) : (subString.length);

		while (true) {
			pos = string.indexOf(subString, pos);
			if (pos >= 0) {
				n++;
				pos += step;
			} else {
				break;
			}
		}
		return (n);
	};

	var getParent = function(bloq, bloqs, IOConnectors) {
		var connector = getOutputConnector(bloq, IOConnectors);
		return getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);

	};

	var getArgsFromBloq = function(bloq, bloqs, IOConnectors) {
		var result;
		if (!bloq) {
			throw 'wadafak';
		}

		while (!bloq.bloqData.arguments) {
			bloq = getParent(bloq, bloqs, IOConnectors);
		}
		var contentData = _.find(bloq.bloqData.content[0], {
			bloqInputId: bloq.bloqData.arguments.bloqInputId
		});
		var connector = _.find(IOConnectors, {
			bloqUuid: bloq.uuid,
			data: {
				name: contentData.name
			}
		});
		if (connector && connector.connectedTo) {
			var childBloq = getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);
			var code = childBloq.getCode();
			result = {
				code: code,
				bloq: childBloq.uuid,
				funcName: '',
				size: occurrencesInString(code, ',', false) + 1
			};
		} else {
			result = {
				code: '',
				bloq: '',
				funcName: '',
				size: 0
			};
		}
		return result;
	};

	var drawSoftwareVars = function(softwareArrays) {
		for (var i = 0; i < softwareArrays.softwareVars.length; i++) {
			//console.log('name: ', softwareArrays.softwareVars[i].name, 'type: ', softwareArrays.softwareVars[i].type);
		}
	};

	var drawSoftwareArray = function(softwareArrays) {
		console.info('drawSoftwareArray');
		drawSoftwareVars(softwareArrays);
		console.info('returnFunctions');
		for (var i = 0; i < softwareArrays.returnFunctions.length; i++) {
			//console.log('name: ', softwareArrays.returnFunctions[i].name, 'type: ', softwareArrays.returnFunctions[i].type);
		}
	};

	var fillSchemaWithContent = function(originalBloqSchema, data) {
		var bloqSchema = _.clone(originalBloqSchema, true),
			k,
			found;

		if (data && data.content) {
			for (var i = 0; i < data.content[0].length; i++) {

				switch (data.content[0][i].alias) {
					case 'varInput':
					case 'numberInput':
					case 'stringInput':
					case 'charInput':
					case 'dynamicDropdown':
					case 'staticDropdown':
					case 'multilineCodeInput':
					case 'multilineCommentInput':
						k = 0;
						found = false;
						while (!found && (k < bloqSchema.content[0].length)) {
							if (data.content[0][i].id === bloqSchema.content[0][k].id) {
								found = true;
								bloqSchema.content[0][k].value = data.content[0][i].value;
							}
							k++;
						}
						if (!found) {
							throw 'Attribute on bloqStructure not found in definition';
						}
						break;
					case 'bloqInput':
						//we do nothing here
						break;
					default:
						throw 'we cant build that option ' + data.content[0][i].alias;
				}
			}
		}

		return bloqSchema;
	};

	var getCode = function(componentsArray, bloqs) {
		var includeCode = '',
			globalVars = '',
			code = '',
			setupCode = '',
			bitbloqLibs = false,
			finalFunctions = '';
		if (bloqs.varsBloq && bloqs.setupBloq && bloqs.loopBloq && componentsArray) {
			if (componentsArray.continuousServos.length >= 1 || componentsArray.servos.length >= 1 || componentsArray.oscillators.length >= 1) {
				includeCode += '#include <Servo.h>\n';
			}
			if (componentsArray.oscillators.length >= 1) {
				if (includeCode.indexOf('#include <Wire.h>') === -1) {
					includeCode += '#include <Wire.h>\n';
				}
				includeCode += '#include <BitbloqOscillator.h>\n';
				bitbloqLibs = true;
			}
			if (componentsArray.lcds.length >= 1) {
				if (includeCode.indexOf('#include <Wire.h>') === -1) {
					includeCode += '#include <Wire.h>\n';
				}
				includeCode += '#include <BitbloqLiquidCrystal.h>\n';
				bitbloqLibs = true;
			}
			if (componentsArray.serialElements.length >= 1) {
				includeCode += '#include <SoftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n';
				bitbloqLibs = true;
			}
			if (componentsArray.clocks.length >= 1) {
				if (includeCode.indexOf('#include <Wire.h>') === -1) {
					includeCode += '#include <Wire.h>\n';
				}
				includeCode += '#include <BitbloqRTC.h>\n';
				bitbloqLibs = true;
			}
			if (componentsArray.hts221.length >= 1) {
				if (includeCode.indexOf('#include <Wire.h>') === -1) {
					includeCode += '#include <Wire.h>\n';
				}
				includeCode += '#include <BitbloqHTS221.h>\n#include <HTS221_Registers.h>\n';
				bitbloqLibs = true;

				componentsArray.hts221.forEach(function(sensor) {
					globalVars += 'HTS221 ' + sensor.name + ';';
					setupCode += 'Wire.begin();' + sensor.name + '.begin();';
				});
			}
			if (componentsArray.sensors.length >= 1) {
				componentsArray.sensors.forEach(function(sensor) {
					if (sensor.type === 'Joystick') {
						includeCode += '#include <BitbloqJoystick.h>\n#include <Wire.h>\n';
						bitbloqLibs = true;
					} else if (sensor.type === 'ButtonPad') {
						includeCode += '#include <BitbloqButtonPad.h>\n';
						bitbloqLibs = true;
					} else if (sensor.type === 'LineFollower') {
						includeCode += '#include <BitbloqLineFollower.h>\n';
						bitbloqLibs = true;
					} else if (sensor.type === 'US') {
						includeCode += '#include <BitbloqUS.h>\n';
						bitbloqLibs = true;
					} else if (sensor.type === 'encoder') {
						includeCode += '#include <BitbloqEncoder.h>\n';
						bitbloqLibs = true;
					}
				});
			}
			//*******BUZZERS*******//
			if (componentsArray.buzzers.length >= 1) {
				componentsArray.buzzers.forEach(function(buzzer) {
					globalVars += 'int ' + buzzer.name + ' = ' + (buzzer.pin.s || '') + ';';
				});
			}
			//*******CLOCKS*******//
			if (componentsArray.clocks.length >= 1) {
				componentsArray.clocks.forEach(function(clock) {
					globalVars += 'RTC_DS1307 ' + clock.name + ';';
				});
			}
			//*******CONTINUOUSSERVOS*******//
			if (componentsArray.continuousServos.length >= 1) {
				componentsArray.continuousServos.forEach(function(continuousServo) {
					globalVars += 'Servo ' + continuousServo.name + ';';
					setupCode += continuousServo.name + '.attach(' + (continuousServo.pin.s || '') + ');';
				});
			}
			if (componentsArray.servos.length >= 1) {
				componentsArray.servos.forEach(function(servo) {
					globalVars += 'Servo ' + servo.name + ';';
					setupCode += servo.name + '.attach(' + (servo.pin.s || '') + ');';
				});
			}
			if (componentsArray.lcds.length >= 1) {
				componentsArray.lcds.forEach(function(lcd) {
					globalVars += 'LiquidCrystal ' + lcd.name + '(0);';
					setupCode += lcd.name + '.begin(16, 2);' + lcd.name + '.clear();';
				});
			}
			if (componentsArray.leds.length >= 1) {
				componentsArray.leds.forEach(function(leds) {
					globalVars += 'int ' + leds.name + ' = ' + (leds.pin.s || '') + ';';
					setupCode += 'pinMode(' + leds.name + ', OUTPUT);';
				});
			}
			if (componentsArray.rgbs.length >= 1) {
				componentsArray.rgbs.forEach(function(rgbs) {
					if (includeCode.indexOf('#include <BitbloqRGB.h>') === -1) {
						includeCode += '#include <BitbloqRGB.h>\n';
					}
					globalVars += 'ZumRGB ' + rgbs.name + '(' + (rgbs.pin.r || '') + ',' + (rgbs.pin.g || '') + ',' + (rgbs.pin.b || '') + ');';
				});
			}
			if (componentsArray.oscillators.length >= 1) {
				componentsArray.oscillators.forEach(function(oscillator) {
					globalVars += 'Oscillator ' + oscillator.name + ';';
					setupCode += oscillator.name + '.attach(' + (oscillator.pin.s || '') + ');';
				});
			}
			if (componentsArray.sensors.length >= 1) {
				componentsArray.sensors.forEach(function(sensor) {
					if (sensor.type === 'analog' || sensor.type === 'digital') {
						globalVars += 'int ' + sensor.name + ' = ' + (sensor.pin.s || '') + ';';
						setupCode += 'pinMode(' + sensor.name + ', INPUT);';
					} else if (sensor.type === 'Joystick') {
						globalVars += 'Joystick ' + sensor.name + '(' + (sensor.pin.x || '') + ',' + (sensor.pin.y || '') + ',' + (sensor.pin.k || '') + ');';
					} else if (sensor.type === 'ButtonPad') {
						globalVars += 'ButtonPad ' + sensor.name + '(' + (sensor.pin.s || '') + ');';
					} else if (sensor.type === 'LineFollower') {
						globalVars += 'LineFollower ' + sensor.name + '(' + (sensor.pin.s1 || '') + ',' + (sensor.pin.s2 || '') + ');';
					} else if (sensor.type === 'US') {
						globalVars += 'US ' + sensor.name + '(' + (sensor.pin.trigger || '') + ',' + (sensor.pin.echo || '') + ');';
					} else if (sensor.type === 'encoder') {
						globalVars += 'Encoder ' + sensor.name + '(encoderUpdaterWrapper,' + (sensor.pin.k || '') + ',' + (sensor.pin.sa || '') + ',' + (sensor.pin.sb || '') + ');';
						finalFunctions += 'void encoderUpdaterWrapper(){' + sensor.name + '.update();}';
					}
				});
			}
			if (componentsArray.serialElements.length >= 1) {
				componentsArray.serialElements.forEach(function(serialElement) {
					if (serialElement.pin.s === 'serial') {
						serialElement.pin.rx = '0';
						serialElement.pin.tx = '1';
					}
					globalVars += 'bqSoftwareSerial ' + serialElement.name + '(' + (serialElement.pin.rx || '') + ',' + (serialElement.pin.tx || '') + ',' + (serialElement.baudRate || '') + ');';
				});
			}
			code = '\n/***   Included libraries  ***/\n' + includeCode + '\n\n/***   Global variables and function definition  ***/\n' + globalVars + bloqs.varsBloq.getCode() + '\n\n/***   Setup  ***/\n' + bloqs.setupBloq.getCode(setupCode) + '\n\n/***   Loop  ***/\n' + bloqs.loopBloq.getCode() + '' + finalFunctions;
		} else {
			//console.log('cant generate code');
		}
		return code;
	};

	var splice = function(string, idx, rem, s) {

		return (string.slice(0, idx) + s + string.slice(idx + Math.abs(rem)));
	};

	var executeFunctionOnConnectedStatementBloqs = function(functionToExecute, bloq, bloqs, connectors) {
		var connector = connectors[bloq.connectors[1]].connectedTo,
			tempBloq;

		while (connector) {
			tempBloq = getBloqByConnectorUuid(connector, bloqs, connectors);
			tempBloq[functionToExecute]();
			connector = connectors[tempBloq.connectors[1]].connectedTo;
		}
	};

	var delay = (function() {
		var timer = 0;
		return function(callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	var getEmptyComponentsArray = function() {
		return {
			leds: [],
			rgbs: [],
			sensors: [],
			buzzers: [],
			servos: [],
			continuousServos: [],
			oscillators: [],
			lcds: [],
			serialElements: [],
			clocks: [],
			hts221: []
		};
	};

	var getArduinoCode = function(componentsArray, program) {
		var varCode = getArduinoCodeFromBloq(program.vars),
			setupCode = getArduinoCodeFromBloq(program.setup),
			loopCode = getArduinoCodeFromBloq(program.loop);
		return varCode + setupCode + loopCode;
	};

	var getArduinoCodeFromBloq = function(bloq) {
		var code = '';
		if (bloq.enable) {
			var contentRegExp = new RegExp('{([A-Z0-9]+)}', 'g'),
				contentConnectionTypeRegExp = new RegExp('{([A-Z0-9]+\.connectionType)}', 'g'),
				regExpResult,
				contents = [];
			code = bloq.code;
			while (regExpResult = contentRegExp.exec(code)) {
				//console.log(regExpResult);
				contents.push(getContentFromBloq(regExpResult[1], bloq));
			}
			//twice bucle because regexp are not working fine
			for (var i = 0; i < contents.length; i++) {
				//console.log('+++');
				//console.log(contents[i].value);
				//console.log((contents[i].value || '').replace(/ \*/g, ''));
				code = code.replace(new RegExp('{' + contents[i].id + '\.withoutAsterisk}', 'g'), (contents[i].value || '').replace(/ \*/g, ''));
				code = code.replace(new RegExp('{' + contents[i].id + '\.connectionType}', 'g'), contents[i].connectionType || '');
				code = code.replace(new RegExp('{' + contents[i].id + '}( )*', 'g'), contents[i].value || '');
			};

			//search for regular expressions:
			var reg = /(.*)\?(.*):(.*)/g;
			if (reg.test(code)) {
				code = eval(code); // jshint ignore:line
			}
			//console.log(code);
		}
		return code;
	};

	var getContentFromBloq = function(contentId, bloq) {
		var content = {
			value: ''
		};

		if (contentId === 'STATEMENTS') {
			content.id = 'STATEMENTS';
			for (var i = 0; i < bloq.childs.length; i++) {
				content.value += getArduinoCodeFromBloq(bloq.childs[i]);
			}
		} else {
			content = _.filter(bloq.content[0], function(elem) {
				if (elem.id === contentId) {
					return true;
				} else if (elem.bloqInputId === contentId) {
					elem.id = contentId;
					return true;
				}
			})[0];
		}
		if (content.alias === 'bloqInput' && content.value) {
			content.connectionType = getTypeFromBloqStructure(content.value);
			content.value = getArduinoCodeFromBloq(content.value);
		}
		return content;
	};

	var getTypeFromBloqStructure = function(bloq) {
		var type = '',
			content = null;
		if (bloq.returnType) {
			switch (bloq.returnType.type) {
				case 'simple':
					type = bloq.returnType.value;
					break;
				case 'fromDropdown':
					content = getContentFromBloq(bloq.returnType.idDropdown, bloq);
					type = content.value;
					break;
				case 'fromDynamicDropdown':
					//type = bloq.returnType.value;
					break;
				case 'fromInput':
					//type = bloq.returnType.value;
					break;
				default:
					throw 'Return type undefined';
			}
		} else {
			throw 'We cant get type from a bloq witouth a returnType';
		}
		return type;
	};

	bloqsUtils.validString = validString;
	bloqsUtils.validChar = validChar;
	bloqsUtils.validComment = validComment;
	bloqsUtils.delay = delay;
	bloqsUtils.validNumber = validNumber;
	bloqsUtils.validName = validName;
	bloqsUtils.generateUUID = generateUUID;
	bloqsUtils.getNumericStyleProperty = getNumericStyleProperty;
	bloqsUtils.itsOver = itsOver;
	bloqsUtils.getLastBottomConnectorUuid = getLastBottomConnectorUuid;
	bloqsUtils.getFirstTopConnectorUuid = getFirstTopConnectorUuid;
	bloqsUtils.getOutputConnector = getOutputConnector;
	bloqsUtils.getTreeHeight = getTreeHeight;
	bloqsUtils.getNodesHeight = getNodesHeight;
	bloqsUtils.drawTree = drawTree;
	bloqsUtils.drawBranch = drawBranch;
	bloqsUtils.getBranchsConnectors = getBranchsConnectors;
	bloqsUtils.getBranchsConnectorsNoChildren = getBranchsConnectorsNoChildren;
	bloqsUtils.getConnectorsUuidByAcceptType = getConnectorsUuidByAcceptType;
	bloqsUtils.getNotConnected = getNotConnected;
	bloqsUtils.getInputsConnectorsFromBloq = getInputsConnectorsFromBloq;
	bloqsUtils.generateBloqInputConnectors = generateBloqInputConnectors;
	bloqsUtils.getBloqByConnectorUuid = getBloqByConnectorUuid;
	bloqsUtils.redrawTree = redrawTree;
	bloqsUtils.itsARootConnector = itsARootConnector;
	bloqsUtils.itsInsideAConnectorRoot = itsInsideAConnectorRoot;
	bloqsUtils.jqueryObjectsArrayToHtmlToInsert = jqueryObjectsArrayToHtmlToInsert;
	bloqsUtils.connectorIsInBranch = connectorIsInBranch;
	bloqsUtils.hasClass = hasClass;
	bloqsUtils.appendArrayInOneTime = appendArrayInOneTime;
	bloqsUtils.drawDropdownOptions = drawDropdownOptions;
	bloqsUtils.getTypeFromBloq = getTypeFromBloq;
	bloqsUtils.drawSoftwareVars = drawSoftwareVars;
	bloqsUtils.drawSoftwareArray = drawSoftwareArray;
	bloqsUtils.sameConnectionType = sameConnectionType;
	bloqsUtils.getFromDynamicDropdownType = getFromDynamicDropdownType;
	bloqsUtils.fillSchemaWithContent = fillSchemaWithContent;
	bloqsUtils.getArgsFromBloq = getArgsFromBloq;
	bloqsUtils.removeInputsConnectorsFromBloq = removeInputsConnectorsFromBloq;
	bloqsUtils.getParent = getParent;
	bloqsUtils.getCode = getCode;
	bloqsUtils.splice = splice;
	bloqsUtils.translateRegExp = translateRegExp;
	bloqsUtils.executeFunctionOnConnectedStatementBloqs = executeFunctionOnConnectedStatementBloqs;
	bloqsUtils.getClassName = getClassName;
	bloqsUtils.getCaretPosition = getCaretPosition;
	bloqsUtils.setCaretPosition = setCaretPosition;
	bloqsUtils.getEmptyComponentsArray = getEmptyComponentsArray;
	bloqsUtils.getArduinoCode = getArduinoCode;

	return bloqsUtils;

})(kenrobot.bloqsUtils = kenrobot.bloqsUtils || {}, _, undefined);

'use strict';
(function(exports, _, bloqsUtils, bloqsLanguages) {
	/**
	 * Events
	 * bloqs:connect
	 * bloqs:dragend
	 * bloqs:bloqremoved
	 * bloqs:change
	 */

	var utils = bloqsUtils,
		lang = 'zh',
		connectors = {},
		IOConnectors = {},
		bloqs = {},
		availableConnectors = [],
		availableIOConnectors = [],
		$field = null,
		scrollTop = 0,
		forcedScrollTop = null,
		softwareArrays = {
			voidFunctions: [],
			returnFunctions: [],
			softwareVars: [],
			classes: [],
			objects: []
		},
		dragPreviousTopPosition,
		dragPreviousLeftPosition,
		dragBloqMousePositionX,
		dragBloqMousePositionY,
		//we cant get the offset if the element its not visible, to avoid calc them on each drag, set them here
		fieldOffsetTop,
		//to relative fields
		fieldOffsetLeft = 0, //Bitbloq value 70,
		fieldOffsetTopSource = [], //bitbloq value['header', 'nav--make', 'actions--make', 'tabs--title'],
		fieldOffsetTopForced = 0,
		mouseDownBloq = null,
		draggingBloq = null,
		startPreMouseMove = null,
		preMouseMoveX,
		preMouseMoveY;

	var setOptions = function(options) {
		fieldOffsetTopSource = options.fieldOffsetTopSource || [];
		fieldOffsetLeft = options.fieldOffsetLeft || 0;
		fieldOffsetTopForced = options.fieldOffsetTopForced || 0;

		if ((options.forcedScrollTop === 0) || options.forcedScrollTop) {
			forcedScrollTop = options.forcedScrollTop;
		}

		lang = options.lang || 'zh';
	};

	var getFieldOffsetTop = function(source) {
		var fieldOffsetTop = 0;
		if (fieldOffsetTopForced) {
			fieldOffsetTop = fieldOffsetTopForced;
		} else {
			var tempElement;
			for (var i = 0; i < source.length; i++) {
				tempElement = document.getElementsByClassName(source[i]);
				if (tempElement[0]) {
					fieldOffsetTop += tempElement[0].clientHeight;
				}
			}
		}

		return fieldOffsetTop;
	};

	var bloqMouseDown = function(evt) {
		//console.log('bloqMouseDown');
		//console.log(evt.target.tagName);
		if (evt.target.tagName !== 'SELECT') {
			//to avoid mousemove event on children and parents at the same time
			evt.stopPropagation();

			mouseDownBloq = evt.currentTarget;
			startPreMouseMove = true;
			document.addEventListener('mousemove', bloqPreMouseMove);
			document.addEventListener('mouseup', bloqMouseUpBeforeMove);
		}
	};

	var bloqMouseUpBeforeMove = function() {
		//console.log('bloqMouseUpBeforeMove');
		mouseDownBloq = null;
		document.removeEventListener('mousemove', bloqPreMouseMove);
		document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
	};

	//to avoid move bloqs with a 1 px movement
	var bloqPreMouseMove = function(evt) {
		if (startPreMouseMove) {
			preMouseMoveX = evt.pageX;
			preMouseMoveY = evt.pageY;
			startPreMouseMove = false;

			//we take values to the bloqsMouseMove from the first move
			var position = mouseDownBloq.getBoundingClientRect();

			//mouse position respect bloq
			dragBloqMousePositionX = evt.pageX - position.left;
			dragBloqMousePositionY = evt.pageY - position.top;

			//the mouse position its relative to the document, we need the top offset from header
			fieldOffsetTop = getFieldOffsetTop(fieldOffsetTopSource);

			//position to control the translate and the distance
			dragPreviousTopPosition = position.top;
			dragPreviousLeftPosition = position.left;

			//to add the scroll to the mouse positions
			scrollTop = $field[0].scrollTop;
		} else {

			var distanceX = evt.pageX - preMouseMoveX,
				distanceY = evt.pageY - preMouseMoveY;

			//console.log('distance', Math.abs(distanceX), Math.abs(distanceY));
			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener('mousemove', bloqPreMouseMove);
				document.addEventListener('mousemove', bloqMouseMove);
			}
		}
	};

	var bloqMouseMove = function(evt) {
		//console.log('bloqMouseMove');
		var bloq = null;
		//actions to do before start to move
		if (mouseDownBloq) {
			bloq = bloqs[mouseDownBloq.getAttribute('data-bloq-id')];

			if (!bloq.isConnectable()) {
				//console.log('its not connectable');
				bloq.doConnectable();
				$field.append(bloq.$bloq);
			}
			document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
			document.addEventListener('mouseup', bloqMouseUp);

			mouseDownBloq.className = mouseDownBloq.className.concat(' dragging');

			switch (bloq.bloqData.type) {
				case 'statement':
				case 'statement-input':
					statementDragStart(bloq);
					break;
				case 'output':
					outputDragStart(bloq);
					break;
				case 'group':
					throw 'Group cant be moved';
				default:
					throw 'Not defined bloq dragstart!!';
			}
			mouseDownBloq = null;
			draggingBloq = bloq;
		}

		bloq = bloq || draggingBloq;
		var distance = moveBloq(bloq, evt.clientX, evt.clientY);

		switch (bloq.bloqData.type) {
			case 'statement':
			case 'statement-input':
				utils.redrawTree(bloq, bloqs, connectors);
				if (distance > 10) {
					handleCollisions([bloq.connectors[0], utils.getLastBottomConnectorUuid(bloq.uuid, bloqs, connectors)], evt);
				}
				break;
			case 'output':
				if (distance > 10) {
					handleIOCollisions(bloq, availableIOConnectors);
				}
				break;
			default:
				throw 'Not defined bloq drag!!';
		}

	};

	var bloqMouseUp = function() {
		//console.log('bloqMouseUp');
		scrollTop = 0;
		var $dropConnector = $('.connector.available').first(),
			bloq = draggingBloq;

		if ($dropConnector[0]) {

			switch (bloq.bloqData.type) {
				case 'statement':
				case 'statement-input':
					statementDragEnd(bloq, $dropConnector);
					break;
				case 'output':
					outputDragEnd(bloq, $dropConnector);
					break;
				default:
					throw 'Not defined bloq drag!!';
			}
			window.dispatchEvent(new Event('bloqs:connect'));

			if (!bloq.$bloq.closest('.bloq--group')[0]) {
				bloq.disable();
				if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
					utils.executeFunctionOnConnectedStatementBloqs('disable', bloq, bloqs, connectors);
				}
			} else {
				bloq.enable();
				if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
					utils.executeFunctionOnConnectedStatementBloqs('enable', bloq, bloqs, connectors);
				}
			}
		} else {
			bloq.disable();
			if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
				utils.executeFunctionOnConnectedStatementBloqs('disable', bloq, bloqs, connectors);
			}

		}
		availableConnectors = [];
		availableIOConnectors = [];
		$('.bloq').removeClass('dragging');
		$('.connector.available').removeClass('available');
		$('.bloq--dragging').removeClass('bloq--dragging');
		$field.focus();
		window.dispatchEvent(new Event('bloqs:dragend'));

		draggingBloq = null;
		dragPreviousTopPosition = 0;
		dragPreviousLeftPosition = 0;

		document.removeEventListener('mousemove', bloqMouseMove);
		document.removeEventListener('mouseup', bloqMouseUp);
	};

	var statementDragStart = function(bloq) {

		var previousConnector = connectors[bloq.connectors[0]].connectedTo;

		if (previousConnector) {
			var previousBloq = bloqs[connectors[previousConnector].bloqUuid];

			var itsInsideAConnectorRoot = utils.itsInsideAConnectorRoot(bloq, bloqs, connectors);

			//desenganchamos
			connectors[previousConnector].connectedTo = null;
			connectors[bloq.connectors[0]].connectedTo = null;

			//miramos si estaba enganchado a un connector-root para sacarlo del parent
			if (itsInsideAConnectorRoot) {

				//setTimeout(function() {
				if (previousBloq.bloqData.type === 'group') {
					//remove class that show help on group bloqs
					previousBloq.$bloq.removeClass('with--content');
				}
				removeFromStatementInput(bloq);
				utils.redrawTree(previousBloq, bloqs, connectors);
				// }, 0);

			}
		}

		availableConnectors = [];

		for (var connectorUuid in connectors) {

			if (connectors[connectorUuid].data.type !== 'connector--empty') {
				if (utils.getBloqByConnectorUuid(connectorUuid, bloqs, connectors).isConnectable()) {
					if (!utils.connectorIsInBranch(connectorUuid, bloq.uuid, bloqs, connectors)) {
						availableConnectors.push(connectorUuid);
					}
				}
			}
		}
	};

	var removeFromStatementInput = function(firstBloqToRemove) {
		var $totalBloqsToRemove = [firstBloqToRemove.$bloq];
		var childConnectorUuid = connectors[firstBloqToRemove.connectors[1]].connectedTo,
			bloqToRemove,
			top = firstBloqToRemove.$bloq.outerHeight(true);

		firstBloqToRemove.$bloq.removeClass('inside-bloq');
		while (childConnectorUuid) {
			bloqToRemove = bloqs[connectors[childConnectorUuid].bloqUuid];
			$totalBloqsToRemove.push(bloqToRemove.$bloq);
			bloqToRemove.$bloq.removeClass('inside-bloq');
			bloqToRemove.$bloq[0].style.transform = 'translate(' + 0 + 'px,' + top + 'px)';
			top += bloqToRemove.$bloq.outerHeight(true);
			childConnectorUuid = connectors[bloqToRemove.connectors[1]].connectedTo;
		}
		utils.appendArrayInOneTime($field, $totalBloqsToRemove);

	};

	var outputDragStart = function(bloq) {
		var outputConnector = utils.getOutputConnector(bloq, IOConnectors);
		if (outputConnector.connectedTo) {
			bloq.$bloq.removeClass('nested-bloq');

			var bloqConnector = IOConnectors[outputConnector.connectedTo],
				oldBloq = bloqs[bloqConnector.bloqUuid];

			//remove the logical conexions
			bloqConnector.connectedTo = null;
			outputConnector.connectedTo = null;

			if (oldBloq.bloqData.returnType && (oldBloq.bloqData.returnType.type === 'fromInput')) {
				updateSoftVar(oldBloq);
			}

			$field[0].appendChild(bloq.$bloq[0]);
		}

		//store the available connectors
		availableIOConnectors = [];
		for (var connectorUuid in IOConnectors) {
			if (IOConnectors[connectorUuid].data.type === 'connector--input') {
				if (utils.getBloqByConnectorUuid(connectorUuid, bloqs, IOConnectors).isConnectable()) {
					if (!IOConnectors[connectorUuid].connectedTo) {
						if (utils.sameConnectionType(bloq, utils.getBloqByConnectorUuid(connectorUuid, bloqs, IOConnectors), IOConnectors[connectorUuid].data.acceptType, bloqs, IOConnectors, softwareArrays)) {
							if (!utils.connectorIsInBranch(connectorUuid, bloq.uuid, bloqs, IOConnectors)) {
								availableIOConnectors.push(connectorUuid);
							}
						}
					}
				}
			}
		}

		// console.log('availableIOConnectors',availableIOConnectors);
	};

	var moveBloq = function(bloq, clientX, clientY) {
		var position = bloq.$bloq[0].getBoundingClientRect(),
			distance = Math.round(Math.sqrt(Math.pow(dragPreviousTopPosition - position.top, 2) + Math.pow(dragPreviousLeftPosition - position.left, 2))),
			x,
			y,
			destinationX,
			destinationY;
		if (scrollTop !== $field[0].scrollTop) {
			scrollTop = $field[0].scrollTop;
		}

		if (forcedScrollTop !== null) {
			scrollTop = forcedScrollTop;
		}

		x = clientX - fieldOffsetLeft;
		y = clientY - fieldOffsetTop + scrollTop;

		destinationX = (x - dragBloqMousePositionX);
		destinationY = (y - dragBloqMousePositionY);

		bloq.$bloq[0].style.transform = 'translate(' + destinationX + 'px,' + destinationY + 'px)';
		if (distance > 10) {
			dragPreviousTopPosition = position.top;
			dragPreviousLeftPosition = position.left;
		}
		if (bloq.bloqData.type === 'statement-input') {
			utils.redrawTree(bloq, bloqs, connectors);
		}

		return distance;
	};

	var statementDragEnd = function(bloq, $dropConnector) {

		var dropConnectorUuid = $dropConnector.attr('data-connector-id');
		var dragConnectorUuid = $('[data-connector-id="' + dropConnectorUuid + '"]').attr('data-canconnectwith');

		//console.log('dragConnectorUuid', dragConnectorUuid);
		//console.log('dropUuid', dropConnectorUuid);
		var areDroppingInsideABloq = utils.itsARootConnector(connectors[dropConnectorUuid]) || utils.itsInsideAConnectorRoot(utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, connectors), bloqs, connectors);

		//console.log('areDroppingInsideABloq?', areDroppingInsideABloq);

		setLogicalConnections(dropConnectorUuid, dragConnectorUuid);
		if (areDroppingInsideABloq) {
			connectorRootDragEnd(bloq, $dropConnector);
		} else {
			placeNestedBloq(dropConnectorUuid, dragConnectorUuid);
		}

	};

	var connectorRootDragEnd = function(dragBloq, $dropConnector) {
		//console.log('connectorRootDragEnd');
		var dropConnectorUuid = $dropConnector.attr('data-connector-id');
		var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];

		dragBloq.$bloq.addClass('inside-bloq');
		dragBloq.$bloq.removeAttr('style');

		if (utils.itsARootConnector(connectors[dropConnectorUuid])) {
			var $dropContainer = dropBloq.$bloq.find('.bloq--extension__content');
			$dropContainer.first().append(dragBloq.$bloq);
			dropBloq.$bloq.addClass('with--content');
		} else {
			dropBloq.$bloq.after(dragBloq.$bloq);
		}

		//var childNodes

		var somethingConnectedInBottomUuid = connectors[dragBloq.connectors[1]].connectedTo;
		var branchBloq;
		var childNodes = [];
		while (somethingConnectedInBottomUuid) {
			branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
			childNodes.push(branchBloq.$bloq);
			branchBloq.$bloq.addClass('inside-bloq');
			branchBloq.$bloq.removeAttr('style');

			somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;

		}
		dragBloq.$bloq.after(utils.jqueryObjectsArrayToHtmlToInsert(childNodes));

		//se repinta el arbol donde esta el dropbloq, porq cambiara de tamaño
		utils.redrawTree(dropBloq, bloqs, connectors);
	};

	var outputDragEnd = function(bloq, $dropConnector) {
		var dropConnectorUuid = $dropConnector.attr('data-connector-id');
		var dragConnectorUuid = utils.getOutputConnector(bloq, IOConnectors).uuid;

		$dropConnector.append(bloq.$bloq);
		bloq.$bloq.addClass('nested-bloq').removeAttr('style');

		IOConnectors[dropConnectorUuid].connectedTo = dragConnectorUuid;
		IOConnectors[dragConnectorUuid].connectedTo = dropConnectorUuid;

		var dropBloq = utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, IOConnectors);
		var dragBloq = utils.getBloqByConnectorUuid(dragConnectorUuid, bloqs, IOConnectors);

		if (dropBloq.bloqData.returnType && (dropBloq.bloqData.returnType.type === 'fromInput')) {
			if (!dragBloq.bloqData.returnType.pointer) {
				updateSoftVar(dropBloq);
			}
		}
	};

	var handleCollisions = function(dragConnectors) {
		var i,
			found,
			$dropConnector,
			$dragConnector,
			tempBloq;

		// For each available connector
		availableConnectors.forEach(function(dropConnectorUuid) {
			$dropConnector = connectors[dropConnectorUuid].jqueryObject;
			i = 0;
			found = false;
			while (!found && (i < dragConnectors.length)) {
				$dragConnector = connectors[dragConnectors[i]].jqueryObject;

				if ((connectors[dragConnectors[i]].data.type === connectors[dropConnectorUuid].data.accept) && utils.itsOver($dragConnector, $dropConnector, 20)) {
					found = true;
				} else {
					i++;
				}
			}
			tempBloq = utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, connectors);
			if (found) {
				$dropConnector.addClass('available');
				$dropConnector.attr('data-canconnectwith', dragConnectors[i]);

				if (tempBloq.bloqData.type === 'group') {
					tempBloq.$bloq.addClass('bloq--dragging');
				}
			} else {
				if (tempBloq.bloqData.type === 'group') {
					tempBloq.$bloq.removeClass('bloq--dragging');
				}
				$dropConnector.removeClass('available');
				$dropConnector.removeAttr('data-canconnectwith');
			}
		});
	};

	var handleIOCollisions = function(bloq, availableIOConnectors) {
		var dropConnector;
		var dragConnector = utils.getOutputConnector(bloq, IOConnectors);
		availableIOConnectors.forEach(function(dropConnectorUuid) {
			dropConnector = IOConnectors[dropConnectorUuid];
			if (utils.itsOver(dragConnector.jqueryObject, dropConnector.jqueryObject, 0) && utils.sameConnectionType(bloqs[dragConnector.bloqUuid], bloqs[dropConnector.bloqUuid], dropConnector.data.acceptType, bloqs, IOConnectors, softwareArrays)) {
				dropConnector.jqueryObject.addClass('available');
			} else {
				dropConnector.jqueryObject.removeClass('available');

			}
		});
	};

	var setLogicalConnections = function(dropConnectorUuid, dragConnectorUUid) {
		//console.log('conectamos', dropConnectorUuid, connectors[dropConnectorUuid].data.type, 'con ', dragConnectorUUid, connectors[dragConnectorUUid].data.type);
		//console.log('conectado con', connectors[dropConnectorUuid].connectedTo, 'y el otro con', connectors[dragConnectorUUid].connectedTo);
		if (connectors[dropConnectorUuid].connectedTo) {
			var dropBottomConnectorUuid, dragBloqLastBottomConnectorUuid, dropTopConnectorUuid, dragBloqFirstTopConnectorUuid;
			switch (connectors[dropConnectorUuid].data.type) {
				case 'connector--bottom':
					dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
					dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
					connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
					connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
					break;
				case 'connector--top':
					dropTopConnectorUuid = connectors[dropConnectorUuid].connectedTo;
					dragBloqFirstTopConnectorUuid = utils.getFirstTopConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
					connectors[dropTopConnectorUuid].connectedTo = dragBloqFirstTopConnectorUuid;
					connectors[dragBloqFirstTopConnectorUuid].connectedTo = dropTopConnectorUuid;
					break;
				case 'connector--root':
					dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
					dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
					connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
					connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
					break;
				default:
					throw 'connector on setLogicalConnections no handled ' + connectors[dropConnectorUuid].data.type;
			}
		}
		connectors[dropConnectorUuid].connectedTo = dragConnectorUUid;
		connectors[dragConnectorUUid].connectedTo = dropConnectorUuid;
	};

	var placeNestedBloq = function(dropConnectorUuid, dragConnectorUuid) {
		//console.log('Nest');

		var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];
		//console.log(dropBloq, dragBloq);

		switch (dropBloq.bloqData.type) {
			case 'statement':
			case 'statement-input':
				utils.redrawTree(utils.getBloqByConnectorUuid(dragConnectorUuid, bloqs, connectors), bloqs, connectors);
				break;
			case 'output':
				break;
			default:
				throw 'bloqtype not defined in nesting ' + dropBloq.bloqData.type;
		}
	};

	var updateSoftVar = function(bloq, name, type, args) {
		var dynamicContentType = bloq.bloqData.createDynamicContent;
		//console.log('updating softVar', dynamicContentType);
		if (!dynamicContentType) {
			throw 'We are adding a softVar on a bloq that not defined the dynamic content';
		}
		if (!softwareArrays[dynamicContentType]) {
			throw 'dynamicContentType not defined ' + bloq.bloqData.name;
		}
		var found = false,
			i = 0;
		while (!found && (i < softwareArrays[dynamicContentType].length)) {
			if (softwareArrays[dynamicContentType][i].bloqUuid === bloq.uuid) {
				found = true;
			}
			i++;
		}
		type = type || utils.getTypeFromBloq(bloq, bloqs, IOConnectors, softwareArrays);
		//arguments if any:
		if (bloq.bloqData.type === 'statement-input' && bloq.bloqData.arguments) {
			args = args || utils.getArgsFromBloq(bloq, bloqs, IOConnectors);
		} else {
			args = '';
		}
		var softVar;
		if (found) {
			softVar = softwareArrays[dynamicContentType][i - 1];
			softVar.name = name || softVar.name;
			softVar.type = type;
			softVar.args = args;
			if (softVar.name) {
				//cambiar data-value cuando el valor sea el mismo que el de la variable que se cambia
				// $('select[data-varreference=' + softVar.id + ']').attr({
				//     'data-value': softVar.name
				// });
				$('option[data-var-id="' + softVar.id + '"]').attr({
					value: softVar.name
				}).html(softVar.name);

			} else {
				removeSoftVar(bloq);
			}

		} else {
			if (name) {
				softVar = {
					name: name,
					id: utils.generateUUID(),
					bloqUuid: bloq.uuid,
					type: type,
					args: args
				};
				softwareArrays[dynamicContentType].push(softVar);
				$('select[data-dropdowncontent="' + dynamicContentType + '"]').append($('<option>').attr({
					'data-var-id': softVar.id,
					value: softVar.name
				}).html(softVar.name));
			}
		}
		//update type of all vars
		updateSoftVarTypes(softwareArrays, dynamicContentType, bloqs, IOConnectors);
		// console.log('afterUpdating: ', softwareArrays);
	};

	var removeSoftVar = function(bloq) {
		var dynamicContentType = bloq.bloqData.createDynamicContent;
		var found = false,
			i = 0;
		while (!found && (i < softwareArrays[dynamicContentType].length)) {
			if (softwareArrays[dynamicContentType][i].bloqUuid === bloq.uuid) {
				found = true;
			}
			i++;
		}
		if (found) {
			var softVar = softwareArrays[dynamicContentType][i - 1];
			softwareArrays[dynamicContentType].splice(i - 1, 1);
			$('option[data-var-id="' + softVar.id + '"]').remove();
		}
		updateSoftVarTypes(softwareArrays, dynamicContentType, bloqs, IOConnectors);
	};

	var updateSoftVarTypes = function(softwareArrays, dynamicContentType, bloqs, IOConnectors) {

		var tempSoftVar;
		for (var i = 0; i < softwareArrays[dynamicContentType].length; i++) {
			tempSoftVar = softwareArrays[dynamicContentType][i];
			tempSoftVar.type = utils.getTypeFromBloq(bloqs[tempSoftVar.bloqUuid], bloqs, IOConnectors, softwareArrays);
		}
		//utils.drawSoftwareArray(softwareArrays);
	};

	var removeBloq = function(bloqUuid, redraw) {
		//console.log('remove:', bloqUuid);
		var bloq = bloqs[bloqUuid],
			i;
		if (bloq) {
			//disconnect
			var topConnector, bottomConnector, outputConnector;
			window.dispatchEvent(new Event('bloqs:bloqremoved'));
			bloq.$bloq[0].removeEventListener('mousedown', bloqMouseDown);
			//if its moving remove all listener
			if ((mouseDownBloq && mouseDownBloq.getAttribute('data-bloq-id') === bloqUuid) ||
				(draggingBloq && draggingBloq.uuid)) {

				document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
				document.removeEventListener('mousemove', bloqPreMouseMove);
				document.removeEventListener('mousemove', bloqMouseMove);
				document.removeEventListener('mouseup', bloqMouseUp);
			}
			switch (bloq.bloqData.type) {
				case 'statement-input':
				case 'group':
					var tempBloq,
						childConnector = connectors[bloq.connectors[2]].connectedTo;

					while (childConnector) {
						tempBloq = utils.getBloqByConnectorUuid(childConnector, bloqs, connectors);
						childConnector = connectors[tempBloq.connectors[1]].connectedTo;
						removeBloq(tempBloq.uuid);
					}
					/* falls through */
				case 'statement':

					topConnector = connectors[bloq.connectors[0]].connectedTo;
					bottomConnector = connectors[bloq.connectors[1]].connectedTo;

					if (topConnector && bottomConnector) {
						connectors[topConnector].connectedTo = bottomConnector;
						connectors[bottomConnector].connectedTo = topConnector;

						if (redraw) {
							utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
						}

					} else if (topConnector) {
						connectors[topConnector].connectedTo = null;
						var previousBloq = bloqs[connectors[topConnector].bloqUuid];
						if (previousBloq.bloqData.type === 'group') {
							previousBloq.$bloq.removeClass('with--content');
						}

						if (redraw) {
							utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
						}
					} else if (bottomConnector) {
						connectors[bottomConnector].connectedTo = null;
					}
					//remove the inputs bloqs inside in 1 level
					var uuid;
					for (i = 0; i < bloq.IOConnectors.length; i++) {
						uuid = bloq.IOConnectors[i];
						if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
							removeBloq(IOConnectors[IOConnectors[uuid].connectedTo].bloqUuid);
						}
					}
					break;
				case 'output':
					outputConnector = IOConnectors[bloq.IOConnectors[0]].connectedTo;

					if (outputConnector) {
						IOConnectors[outputConnector].connectedTo = null;
					}
					break;
				default:
					throw 'we dont know how to delete: ' + bloq.bloqData.type;
			}

			//remove visual
			bloq.$bloq.remove();
			//removeLogical
			var key;
			for (i = 0; i < bloq.connectors.length; i++) {
				delete connectors[bloq.connectors[i]];
			}
			for (i = 0; i < bloq.IOConnectors.length; i++) {
				delete IOConnectors[bloq.IOConnectors[i]];
			}

			//si es un bloq que genera dinmayc content
			if (bloq.bloqData.createDynamicContent) {
				removeSoftVar(bloq);
			} else {
				for (key in softwareArrays) {
					updateSoftVarTypes(softwareArrays, key, bloqs, IOConnectors);
				}
			}

			//remove the bloq
			delete bloqs[bloqUuid];

		} else {
			throw 'Cant delete this bloq: ' + bloqUuid;
		}

	};

	var buildContent = function(bloq) {

		var componentsArray = bloq.componentsArray,
			bloqData = bloq.bloqData;
		var $tempElement;
		for (var j = 0; j < bloqData.content.length; j++) {
			for (var k = 0; k < bloqData.content[j].length; k++) {
				$tempElement = createBloqElement(bloq, bloqData.content[j][k], componentsArray, softwareArrays);
				if (bloqData.content[j][k].position === 'DOWN') {
					bloq.$contentContainerDown.addClass('with-content');
					bloq.$contentContainerDown.append($tempElement);
				} else {
					bloq.$contentContainer.append($tempElement);
				}
			}
		}
	};

	var buildStatementConnector = function(tempUuid, bloqConnectors, bloq, tempConnector, $container) {
		var $connector = $('<div>').attr({
			'data-connector-id': tempUuid
		});

		$connector.addClass('connector connector--offline ' + bloqConnectors.type);

		$container.append($connector);

		connectors[tempUuid] = tempConnector;

		bloq.connectors.push(tempUuid);
		return $connector;
	};

	var buildConnectors = function(bloqConnectors, bloq) {
		//connectors
		var $connector, tempUuid, tempConnector, $container;
		for (var i = 0; i < bloqConnectors.length; i++) {

			tempUuid = 'connector:' + utils.generateUUID();

			tempConnector = {
				uuid: tempUuid,
				data: bloqConnectors[i],
				bloqUuid: bloq.uuid,
				connectedTo: null
			};

			switch (bloqConnectors[i].type) {
				case 'connector--top':
					if (bloq.bloqData.type === 'statement-input') {
						$container = bloq.$bloq.children('.bloq--statement-input__header');
					} else {
						$container = bloq.$bloq.children('.bloq--fixed');
					}
					$connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);
					break;
				case 'connector--bottom':
					if (bloq.bloqData.type === 'statement-input') {
						$container = bloq.$bloq.find('.bloq--extension--end');
					} else {
						$container = bloq.$bloq.children('.bloq--fixed');
					}
					$connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);
					break;
				case 'connector--root':
					if (bloq.bloqData.type === 'statement-input') {
						$container = bloq.$bloq.children('.bloq--statement-input__header');
					} else {
						$container = bloq.$bloq;
					}
					$connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);

					break;
				case 'connector--input':
					$connector = $(bloq.$bloq.find('.bloqinput[data-connector-name="' + bloqConnectors[i].name + '"]'));

					$connector.attr({
						'data-connector-id': tempUuid
					}).addClass('connector ' + bloqConnectors[i].type);
					tempConnector.contentId = $connector.attr('data-content-id');
					IOConnectors[tempUuid] = tempConnector;
					bloq.IOConnectors.push(tempUuid);
					break;
				case 'connector--output':
					$connector = $('<div>').attr({
						'data-connector-id': tempUuid
					}).addClass('connector connector--offline ' + bloqConnectors[i].type);

					bloq.$bloq.append($connector);

					tempConnector.returnType = bloq.bloqData.returnType;
					IOConnectors[tempUuid] = tempConnector;

					bloq.IOConnectors.push(tempUuid);
					break;
				case 'connector--empty':
					$connector = $('<div>');
					connectors[tempUuid] = tempConnector;

					bloq.connectors.push(tempUuid);
					break;
				default:
					throw 'Connector not defined to build';
			}
			tempConnector.jqueryObject = $connector;
		}
	};

	var createBloqElement = function(bloq, elementSchema, componentsArray, softwareArrays) {
		var i,
			$tempElement,
			$element = null,
			arrayOptions,
			key;
		switch (elementSchema.alias) {
			case 'staticDropdown':
				//component
				$element = $('<select>');
				$element.attr({
					name: '',
					'data-content-id': elementSchema.id
				});

				var childs = [];
				for (i = 0; i < elementSchema.options.length; i++) {
					$tempElement = $('<option>').attr({
						value: elementSchema.options[i].value,
						'data-i18n': elementSchema.options[i].label
					}).html(translateBloq(lang, elementSchema.options[i].label));
					childs.push($tempElement);
				}
				utils.appendArrayInOneTime($element, childs);
				if (elementSchema.value) {
					$element.val(elementSchema.value);
				}

				$element.change(function() {
					window.dispatchEvent(new Event('bloqs:change'));
				});

				if (bloq.bloqData.returnType && bloq.bloqData.returnType.type === 'fromDropdown') {
					$element.change(function() {
						updateSoftVar(bloq);
					});
				}

				break;
			case 'dynamicDropdown':
				$element = $('<select>');
				$element.attr({
					name: '',
					'data-content-id': elementSchema.id,
					'data-dropdowncontent': elementSchema.options,
					'data-value': elementSchema.value
				});

				switch (elementSchema.options) {
					case 'voidFunctions':
					case 'returnFunctions':
					case 'softwareVars':
					case 'classes':
					case 'objects':
						arrayOptions = softwareArrays[elementSchema.options];
						$element.change(function() {
							//if we change a dynamicDropdown, can be for two reasons
							// We are a output and we refresh vars of the old BLoq
							// We are selecting a variable in a statement, and we update the dont change type
							if (bloq.bloqData.type === 'output') {
								var outputConnector = utils.getOutputConnector(bloq, IOConnectors);
								//if its connected to another bloq, we update the vars of the old bloq
								if (outputConnector.connectedTo) {

									var bloqConnector = IOConnectors[outputConnector.connectedTo],
										oldBloq = bloqs[bloqConnector.bloqUuid];

									if (oldBloq.bloqData.returnType && (oldBloq.bloqData.returnType.type === 'fromInput')) {
										updateSoftVar(oldBloq);
									}
								}
							}
						});
						break;
					case 'varComponents':
						arrayOptions = [];

						for (key in componentsArray) {
							if (componentsArray[key].length >= 1) {
								arrayOptions = arrayOptions.concat(componentsArray[key]);
							}
						}
						break;
					case 'clocks':
						arrayOptions = [];
						arrayOptions = componentsArray.clocks;
						break;
					case 'hts221':
						arrayOptions = [];
						arrayOptions = componentsArray.hts221;
						break;
					default:
						arrayOptions = componentsArray[elementSchema.options];
				}
				if (!arrayOptions) {
					throw 'Dropdowns not defined in array: ' + elementSchema.options;
				}

				//content
				utils.drawDropdownOptions($element, arrayOptions);

				if (elementSchema.value) {
					$element.val(elementSchema.value);
					var componentRef = arrayOptions.find(function(item) {
						return item.name === elementSchema.value;
					});
					$element[0].dataset.reference = componentRef ? componentRef.uid : '';
					$element[0].dataset.value = elementSchema.value;
					$element.val(elementSchema.value);
				}

				$element.change(function(evt) {
					$element[0].dataset.value = evt.currentTarget.value;
					$element[0].dataset.reference = evt.currentTarget.selectedOptions[0].dataset.reference;
					//$element[0].dataset.varreference = evt.currentTarget.selectedOptions[0].dataset.varId;
					window.dispatchEvent(new Event('bloqs:change'));
				});

				break;
			case 'text':
				$element = $('<span>').attr({
					'data-i18n': elementSchema.value
				}).html(translateBloq(lang, elementSchema.value));
				break;
			case 'removableText':
				$element = $('<span>').html(elementSchema.value);
				$element.addClass('removabletext');

				break;
			case 'numberInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				//Check that the characters are numbers
				$element.bind('input', function() {
					var position = utils.getCaretPosition(this);
					var a = utils.validNumber($(this).val());
					$(this).val(a.value);
					utils.setCaretPosition(this, position - a.removedChar);
				});
				$element.change(function() {
					//console.log('change number!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'stringInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.alias,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					$element.val(utils.validString($element.val()));
					//console.log('change String!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'charInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.alias,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					$element.val(utils.validChar($element.val()));
					//console.log('change Char!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'codeInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.alias,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				$element.change(function() {
					//console.log('change SCinput!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'multilineCodeInput':
				$element = $('<textarea class="msd-elastic: \n;" spellcheck="false" ng-model="bar" cols="40" rows="1"></textarea>').attr({
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.alias,
					'name': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				setTimeout(function() {
					$('[name="' + elementSchema.id + '"]').autogrow({
						onInitialize: true
					});
				}, 0);
				$element.change(function() {
					//console.log('change multilineCode!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'multilineCommentInput':
				$element = $('<textarea class="msd-elastic: \n;" spellcheck="false" ng-model="bar" cols="40" rows="1"></textarea>').attr({
					'data-content-id': elementSchema.id,
					'data-content-type': elementSchema.alias,
					'name': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);
				setTimeout(function() {
					$('[name="' + elementSchema.id + '"]').autogrow({
						onInitialize: true
					});
				}, 0);

				$element.keyup(function() {
					bloqsUtils.delay(function() {
						$element.val(utils.validComment($element.val()));
					}, 1000);
				});

				$element.change(function() {
					$element.val(utils.validComment($element.val()));
					//console.log('change multilineComment!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'varInput':
				$element = $('<input>').attr({
					type: 'text',
					'data-content-id': elementSchema.id,
					'data-placeholder-i18n': elementSchema.placeholder,
					placeholder: translateBloq(lang, elementSchema.placeholder)
				}).val(elementSchema.value);

				bloq.varInputs = [];
				bloq.varInputs.push($element);
				$element.addClass('var--input');
				//Transform the name to create valid function / variables names
				$element.keyup(function() {
					bloqsUtils.delay(function() {
						var name = utils.validName($element.val(), softwareArrays);
						$element.val(name);
						if (name) {
							updateSoftVar(bloq, name);
						} else {
							removeSoftVar(bloq, name);
						}
					}, 1000);
				});

				$element.change(function() {
					//console.log('change varInput!');
					window.dispatchEvent(new Event('bloqs:change'));
				});
				break;
			case 'bloqInput':
				$element = $('<div>').attr({
					'data-connector-name': elementSchema.name,
					'data-content-id': elementSchema.bloqInputId
				});
				$element.addClass('bloqinput');
				break;
			case 'headerText':
				$element = $('<h3>').html(elementSchema.value);
				$element.addClass('headerText');
				break;
			case 'descriptionText':
				$element = $('<p>').html(elementSchema.value);
				$element.addClass('descriptionText');
				break;
			default:
				throw 'elementSchema not defined: ' + elementSchema.alias;
		}

		return $element;
	};

	var destroyFreeBloqs = function() {
		var uuid, bloq;
		for (uuid in bloqs) {
			bloq = bloqs[uuid];
			if (bloq.isConnectable()) {
				switch (bloq.bloqData.type) {
					case 'statement':
					case 'statement-input':
						if (!connectors[bloq.connectors[0]].connectedTo) {
							removeBloq(uuid);
						}
						break;
					case 'output':
						if (!IOConnectors[bloq.IOConnectors[0]].connectedTo) {
							removeBloq(uuid);
						}
						break;
					case 'group':
						break;
					default:
						throw 'its free? ' + bloq.bloqData.type;
				}
			}
		}
	};

	/**
	 * Get bloqs that are not connected
	 *
	 */
	var getFreeBloqs = function() {
		var bloq,
			result = [],
			bloqGroup,
			tempBloq,
			connectedConnector;
		for (var uuid in bloqs) {
			bloq = bloqs[uuid];
			if (bloq.isConnectable()) {
				switch (bloq.bloqData.type) {
					case 'statement':
					case 'statement-input':
						if (!connectors[bloq.connectors[0]].connectedTo) {
							bloqGroup = [bloq.getBloqsStructure()];
							connectedConnector = connectors[bloq.connectors[1]].connectedTo;
							while (connectedConnector) {
								tempBloq = utils.getBloqByConnectorUuid(connectedConnector, bloqs, connectors);
								bloqGroup.push(tempBloq.getBloqsStructure());
								connectedConnector = connectors[tempBloq.connectors[1]].connectedTo;
							}
							result.push({
								position: bloq.$bloq.position(),
								bloqGroup: bloqGroup
							});
						}
						break;
					case 'output':
						if (!IOConnectors[bloq.IOConnectors[0]].connectedTo) {
							bloqGroup = [bloq.getBloqsStructure()];
							result.push({
								position: bloq.$bloq[0].getBoundingClientRect(),
								bloqGroup: bloqGroup
							});
						}
						break;
					case 'group':
						break;
					default:
						throw 'its free? ' + bloq.bloqData.type;
				}
			}
		}
		return result;
	};

	var updateDropdowns = function() {
		var key;
		for (key in softwareArrays) {
			updateDropdown(key);
		}
	};

	var updateDropdown = function(softwareArrayKey) {
		var $element, tempValue;
		$('select[data-dropdownContent="' + softwareArrayKey + '"]').each(function(index, element) {
			$element = $(element);
			tempValue = $element.attr('data-value');
			bloqsUtils.drawDropdownOptions($element, softwareArrays[softwareArrayKey]);
			if (tempValue) {
				$element.val(tempValue);
			}
		});
	};

	var translateBloq = function(lang, key) {
		return bloqsLanguages.texts[lang][key] || key;
	};

	// Block Constructor
	var Bloq = function Bloq(params) {
		this.uuid = 'bloq:' + utils.generateUUID();

		$field = params.$field || $field;

		this.bloqData = params.bloqData;
		this.componentsArray = params.componentsArray;
		this.connectors = [];
		this.IOConnectors = [];

		var enable = false,
			connectable,
			that = this;

		this.collapseGroupContent = function() {

			var $fieldContent = that.$bloq.children('.field--content');
			//$fieldContent = $(e.currentTarget).parent().find('.field--content');
			$fieldContent.toggleClass('field--collapsed');
			that.connectable = !that.connectable;
			$fieldContent.parent().toggleClass('collapsed--field');
		};

		this.enable = function(onlyParent) {
			if (!enable) {
				this.$bloq.removeClass('disabled');
				//console.log('activamos', this.uuid, this.bloqData.name);
				if (this.bloqData.content && this.bloqData.content[0]) {
					for (var i = 0; i < this.bloqData.content[0].length; i++) {
						if (this.bloqData.content[0][i].alias === 'bloqInput') {
							var uuid;
							for (var j = 0; j < this.IOConnectors.length; j++) {
								uuid = this.IOConnectors[j];
								if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
									utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).enable();
								}
							}
						}
					}
				}

				enable = true;

				if (this.connectors[2] && !onlyParent) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBloq;
					while (connector) {
						tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
						tempBloq.enable();
						connector = connectors[tempBloq.connectors[1]].connectedTo;
					}
				}
			}
		};

		this.disable = function(onlyParent) {
			this.$bloq.addClass('disabled');
			if (enable) {

				//console.log('activamos', this.uuid, this.bloqData.name);
				if (this.bloqData.content && this.bloqData.content[0]) {
					for (var i = 0; i < this.bloqData.content[0].length; i++) {
						switch (this.bloqData.content[0][i].alias) {
							case 'bloqInput':
								//disable the inputs bloqs inside in 1 level
								var uuid;
								for (var j = 0; j < this.IOConnectors.length; j++) {
									uuid = this.IOConnectors[j];
									if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
										utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).disable();
									}
								}
								break;
							default:
						}
					}
				}

				enable = false;

				if (this.connectors[2] && !onlyParent) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBloq;
					while (connector) {
						tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
						tempBloq.disable();
						connector = connectors[tempBloq.connectors[1]].connectedTo;
					}
				}
			}
		};

		this.itsEnabled = function() {
			return enable;
		};

		this.doConnectable = function() {
			if (!connectable) {
				// console.log('make them connectable', this.uuid, this.bloqData.name);
				if (this.bloqData.content && this.bloqData.content[0]) {
					for (var i = 0; i < this.bloqData.content[0].length; i++) {
						if (this.bloqData.content[0][i].alias === 'bloqInput') {
							var uuid;
							for (var j = 0; j < this.IOConnectors.length; j++) {
								uuid = this.IOConnectors[j];
								if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
									utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).doConnectable();
								}
							}
						}
					}
				}
				if (this.connectors[2]) {
					var connector = connectors[this.connectors[2]].connectedTo,
						tempBloq;
					while (connector) {
						tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
						tempBloq.doConnectable();
						connector = connectors[tempBloq.connectors[1]].connectedTo;
					}
				}
				connectable = true;
				this.$bloq[0].dispatchEvent(new Event('bloq:connectable'));
			}
		};

		this.doNotConnectable = function() {
			connectable = false;
		};

		this.isConnectable = function() {
			return connectable;
		};

		this.itsFree = function() {
			return (this.$bloq.closest('.bloq--group').length === 0);
		};

		//creation
		this.$bloq = $('<div>').attr({
			'data-bloq-id': this.uuid,
			tabIndex: 0
		});

		this.$bloq.addClass('bloq bloq--' + this.bloqData.type + ' ' + this.bloqData.bloqClass);

		bloqs[this.uuid] = this;

		//this.disable();
		this.doNotConnectable();

		switch (this.bloqData.type) {
			case 'statement-input':
				this.$bloq.append('<div class="bloq--statement-input__header"></div><div class="bloq--extension"><div class="bloq--extension__content"></div> <div class="bloq--extension--end"></div></div>');
				this.$contentContainer = this.$bloq.find('.bloq--statement-input__header');
				this.$contentContainerDown = this.$bloq.find('.bloq--extension--end');
				//this.$bloq.attr('draggable', true);
				buildContent(this);
				this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
				buildConnectors(params.bloqData.connectors, this);
				this.$contentContainer.children().children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
				this.$contentContainer.children().children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
				this.$contentContainer.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
				this.$contentContainerDown.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
				this.$contentContainerDown.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
				break;
			case 'statement':
				this.$bloq.append('<div class="bloq--fixed">');
				this.$contentContainer = this.$bloq.find('.bloq--fixed');
				//this.$bloq.attr('draggable', true);
				buildContent(this);
				this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
				buildConnectors(params.bloqData.connectors, this);
				this.$bloq.children().children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
				this.$bloq.children().children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
				break;
			case 'output':
				this.$contentContainer = this.$bloq;
				//this.$bloq.attr('draggable', true);
				buildContent(this);
				this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
				buildConnectors(params.bloqData.connectors, this);
				this.$bloq.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
				this.$bloq.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
				break;
			case 'group':
				this.$bloq.append('<div class="field--header"><button class="btn btn--collapsefield"></button><h3 data-i18n="' + this.bloqData.headerText + '">' + translateBloq(lang, this.bloqData.headerText) + '</h3></div><div class="field--content"><p data-i18n="' + this.bloqData.descriptionText + '">' + translateBloq(lang, this.bloqData.descriptionText) + '</p><div class="bloq--extension--info" data-i18n="drag-bloq" > ' + translateBloq(lang, 'drag-bloq') + '</div><div class="bloq--extension__content"></div></div>');

				buildConnectors(params.bloqData.connectors, this);
				this.$bloq.find('.connector--root').addClass('connector--root--group');
				this.$bloq.find('.field--header .btn').on('click', this.collapseGroupContent);
				this.$bloq.find('.field--header h3').on('click', this.collapseGroupContent);
				break;
			default:
				throw 'bloqData ' + this.bloqData.type + 'not defined in bloq construction';
		}

		if (this.bloqData.createDynamicContent) {
			var name = utils.validName(this.$bloq.find('input.var--input').val());
			if (name) {
				updateSoftVar(this, name);
			} else {
				removeSoftVar(this, name);
			}
		}

		this.getIOConnectorUuidByContentId = function(contentId) {
			var found = false,
				i = 0,
				result = null;

			while (!found && (i < this.IOConnectors.length)) {
				if (IOConnectors[this.IOConnectors[i]].contentId === contentId) {
					found = true;
					result = this.IOConnectors[i];
				}
				i++;
			}
			return result;
		};

		this.getCode = function(previousCode) {
			var code = this.bloqData.code;
			var childBloq, childConnectorId;
			var elementTags = _.without(_.pluck(this.bloqData.content[0], 'id'), undefined);
			var childrenTags = _.without(_.pluck(this.bloqData.content[0], 'bloqInputId'), undefined);
			var value = '',
				type = '';
			var connectionType = '';

			elementTags.forEach(function(elem) {
				var element = this.$contentContainer.find('> [data-content-id="' + elem + '"]');
				if (element.length === 0) {
					element = this.$contentContainer.find('[data-content-id="' + elem + '"]');
				}
				value = element.val() || '';
				//hardcoded!!
				for (var j = 0; j < this.componentsArray.sensors.length; j++) {

					if (value === this.componentsArray.sensors[j].name) {
						type = this.componentsArray.sensors[j].type;
						if (type === 'analog') {
							value = 'analogRead(' + this.componentsArray.sensors[j].pin.s + ')';
						} else if (type === 'digital') {
							value = 'digitalRead(' + this.componentsArray.sensors[j].pin.s + ')';
						} else if (type === 'LineFollower') { // patch. When the new Web2Board is launched with float * as return, remove this
							value = '(float *)' + this.componentsArray.sensors[j].name + '.read()';

						} else {
							value = this.componentsArray.sensors[j].name + '.read()';
						}
						code = code.replace(new RegExp('{' + elem + '.type}', 'g'), value);
					}

				}
				if (element.attr('data-content-type') === 'stringInput') {
					value = utils.validString(value);
				} else if (element.attr('data-content-type') === 'charInput') {
					value = utils.validChar(value);
				} else if (element.attr('data-content-type') === 'multilineCommentInput') {
					value = utils.validComment(value);
				}
				var valueWithoutAsterisk = value.replace(' *', '');
				code = code.replace(new RegExp('{' + elem + '}.withoutAsterisk', 'g'), valueWithoutAsterisk);
				code = code.replace(new RegExp('{' + elem + '}', 'g'), value);
			}.bind(this));

			var bloqInputConnectors = utils.getInputsConnectorsFromBloq(IOConnectors, bloqs, this);
			if (childrenTags.length > 0) {
				// search for child bloqs:
				for (var k = 0; k < bloqInputConnectors.length; k++) {

					value = '';
					connectionType = '';
					type = '';
					var a = IOConnectors[bloqInputConnectors[k]];
					if (a) {
						childConnectorId = a.connectedTo;
						if (childConnectorId !== null) {
							childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, IOConnectors);
							value = childBloq.getCode();
							type = childBloq.bloqData.returnType;
						}
						if (type.type === 'fromDynamicDropdown') {
							connectionType = utils.getFromDynamicDropdownType(childBloq || this, type.idDropdown, type.options, softwareArrays, this.componentsArray);
						} else if (type.type === 'fromDropdown') {
							connectionType = utils.getTypeFromBloq(childBloq || this, bloqs, IOConnectors, softwareArrays);
						} else {
							connectionType = type.value;
							if (connectionType === 'string') {
								connectionType = 'String';
							}
						}
					}
					if (connectionType === undefined) {
						connectionType = '';
					}
					code = code.replace(new RegExp('{' + childrenTags[k] + '.connectionType}', 'g'), connectionType);
					code = code.replace(new RegExp('{' + childrenTags[k] + '}', 'g'), value);

				}
			}
			//search for regular expressions:
			var reg = /(.*)\?(.*):(.*)/g;
			if (reg.test(code)) {
				code = eval(code); // jshint ignore:line
			}
			var children = [];
			if (this.connectors[2]) {
				value = '';
				childConnectorId = connectors[this.connectors[2]].connectedTo;
				if (childConnectorId) {
					childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, connectors);
					var branchConnectors = utils.getBranchsConnectorsNoChildren(childBloq.uuid, connectors, bloqs);

					branchConnectors.forEach(function(branchConnector) {
						if (utils.itsInsideAConnectorRoot(bloqs[connectors[branchConnector].bloqUuid], bloqs, connectors)) {
							var bloqId = connectors[branchConnector].bloqUuid;
							if (bloqId !== children[children.length - 1]) {
								children.push(bloqId);
							}
						}
					});
				}
				children.forEach(function(elem) {
					value += bloqs[elem].getCode();
				});
				// if (children.length >= 1) {
				//     for (i in children) {
				//         value += bloqs[children[i]].getCode();
				//     }
				// }
				code = code.replace(new RegExp('{STATEMENTS}', 'g'), value);
			}
			if (code.indexOf('{CLASS-OUTSIDE}') >= 0) {
				var rootParentName = utils.getClassName(this, bloqs, connectors);
				if (rootParentName) {
					code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), rootParentName);
				}
				code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), '');
			}
			if (previousCode === undefined) {
				previousCode = '';
			} else { //the previousCode is always (from now) inserted after the void setup(){ string
				code = bloqsUtils.splice(code, code.indexOf('{') + 1, 0, previousCode);
			}
			if (!this.itsEnabled()) {
				//TODO: search highest parent disabled and add the comment characters
				// code = '/*' + code + '*/';
				code = '';
			}
			return code;
		};

		this.getBloqsStructure = function(fullStructure) {
			var result,
				tempBloq;

			if (fullStructure) {
				result = _.cloneDeep(this.bloqData);
			} else {
				result = {
					name: this.bloqData.name,
					content: [
						[]
					]
				};
			}
			result.enable = this.itsEnabled();

			var rootConnector = this.connectors[2];
			if (rootConnector) {
				result.childs = [];
				var connectedConnector = connectors[rootConnector].connectedTo;
				while (connectedConnector) {
					tempBloq = utils.getBloqByConnectorUuid(connectedConnector, bloqs, connectors);
					result.childs.push(tempBloq.getBloqsStructure(fullStructure));
					connectedConnector = connectors[tempBloq.connectors[1]].connectedTo;
				}
			}

			var tempObject, value, selectedValue, attributeValue;
			if (this.bloqData.content[0]) {

				for (var i = 0; i < this.bloqData.content[0].length; i++) {
					tempObject = null;
					switch (this.bloqData.content[0][i].alias) {
						case 'varInput':
						case 'stringInput':
						case 'numberInput':
						case 'multilineCodeInput':
						case 'multilineCommentInput':
						case 'codeInput':
						case 'charInput':
							value = this.$bloq.find('[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
							if (value) {
								tempObject = {
									alias: this.bloqData.content[0][i].alias,
									id: this.bloqData.content[0][i].id,
									value: value
								};
							}
							break;
						case 'bloqInput':
							//get the inputs bloqs inside in 1 level
							var uuid,
								connectedBloq;
							uuid = this.getIOConnectorUuidByContentId(this.bloqData.content[0][i].bloqInputId);
							if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
								connectedBloq = utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors);
								tempObject = {
									alias: this.bloqData.content[0][i].alias,
									bloqInputId: this.bloqData.content[0][i].bloqInputId,
									value: connectedBloq.getBloqsStructure(fullStructure)
								};
							}

							break;
						case 'dynamicDropdown':
							attributeValue = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"][data-dropdowncontent="' + this.bloqData.content[0][i].options + '"]').attr('data-value');
							selectedValue = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"][data-dropdowncontent="' + this.bloqData.content[0][i].options + '"]').val();
							//only software Vars get value from val(), hardware, use attribute or val()
							var variableType = this.bloqData.content[0][i].options;
							var itsSoftwareValue = Object.keys(softwareArrays).indexOf(variableType);

							if (itsSoftwareValue !== -1) {
								value = selectedValue;
							} else {
								value = attributeValue || selectedValue;
							}

							// console.log('val', attributeValue, selectedValue);
							if (value) {
								tempObject = {
									alias: this.bloqData.content[0][i].alias,
									id: this.bloqData.content[0][i].id,
									value: value
								};
							}
							break;
						case 'staticDropdown':
							//value = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
							value = this.$contentContainer.find('> select[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
							if (value) {
								tempObject = {
									alias: this.bloqData.content[0][i].alias,
									id: this.bloqData.content[0][i].id,
									value: value
								};
							}
							break;
						case 'text':
							//we dont catch this field
							break;
						default:
							throw 'I dont know how to get the structure from this contentType :( ' + this.bloqData.content[0][i].alias;
					}
					if (tempObject) {
						if (fullStructure) {
							result.content[0][i].value = tempObject.value;
						} else {
							result.content[0].push(tempObject);
						}
					}

				}
			}

			return result;
		};

		return this;
	};


	var buildBloqWithContent = function(data, componentsArray, schemas, $field) {

		var tempBloq,
			originalBloqSchema = schemas[data.name],
			bloqSchema,
			lastBottomConnector,
			tempNodeBloq,
			tempOutputBloq,
			inputConnectorUuid,
			$dropContainer,
			i;


		if (!originalBloqSchema) {
			console.error('no original schema', data);
		}
		//fill the schema with content
		bloqSchema = bloqsUtils.fillSchemaWithContent(originalBloqSchema, data);
		tempBloq = new Bloq({
			bloqData: bloqSchema,
			componentsArray: componentsArray,
			$field: $field
		});

		if (data.content) {
			for (i = 0; i < data.content[0].length; i++) {
				if (data.content[0][i].alias === 'bloqInput') {
					inputConnectorUuid = tempBloq.getIOConnectorUuidByContentId(data.content[0][i].bloqInputId);
					$dropContainer = tempBloq.$bloq.find('[data-connector-id="' + inputConnectorUuid + '"]').first();
					//console.debug($dropContainer);
					//inputConnectorUuid = $dropContainer.attr('data-connector-id');
					//console.debug(inputConnectorUuid);
					tempOutputBloq = buildBloqWithContent(data.content[0][i].value, componentsArray, schemas, $field);
					tempOutputBloq.$bloq.addClass('nested-bloq');
					//Connections in bloqInput
					//logical
					if (!IOConnectors[inputConnectorUuid]) {
						console.debug('not connector?', originalBloqSchema);
					}
					IOConnectors[inputConnectorUuid].connectedTo = tempOutputBloq.IOConnectors[0];
					IOConnectors[tempOutputBloq.IOConnectors[0]].connectedTo = inputConnectorUuid;
					//visual
					//$dropContainer[0].appendChild(tempOutputBloq.$bloq[0])
					$dropContainer.append(tempOutputBloq.$bloq);
				}
			}
		}

		if (data.childs) {

			$dropContainer = tempBloq.$bloq.find('.bloq--extension__content');
			lastBottomConnector = tempBloq.connectors[2];

			if (data.childs.length > 0) {
				tempBloq.$bloq.addClass('with--content');
			}
			for (i = 0; i < data.childs.length; i++) {
				tempNodeBloq = buildBloqWithContent(data.childs[i], componentsArray, schemas, $field);
				//Connections in statement
				//logical
				connectors[lastBottomConnector].connectedTo = tempNodeBloq.connectors[0];
				connectors[tempNodeBloq.connectors[0]].connectedTo = lastBottomConnector;
				lastBottomConnector = tempNodeBloq.connectors[1];

				//visual
				tempNodeBloq.$bloq.addClass('inside-bloq');
				$dropContainer.append(tempNodeBloq.$bloq);
			}
		}

		if (data.enable) {
			tempBloq.enable(true);
		} else {

			tempBloq.disable();
		}
		if (tempBloq.bloqData.createDynamicContent) {
			updateSoftVar(tempBloq);
		}

		return tempBloq;
	};

	exports.Bloq = Bloq;
	exports.updateSoftVar = updateSoftVar;
	exports.connectors = connectors;
	exports.IOConnectors = IOConnectors;
	exports.bloqs = bloqs;
	exports.removeBloq = removeBloq;

	exports.getFreeBloqs = getFreeBloqs;
	exports.destroyFreeBloqs = destroyFreeBloqs;
	exports.updateDropdowns = updateDropdowns;
	exports.setOptions = setOptions;
	exports.buildBloqWithContent = buildBloqWithContent;

	return exports;

})(kenrobot.bloqs = kenrobot.bloqs || {}, _, kenrobot.bloqsUtils, kenrobot.bloqsLanguages, undefined);

(function() {
	'use strict';
	angular.module('kenrobot')
		// I provide an injectable (and exteded) version of the underscore / lodash lib.
		.factory('bloqs', function($window) {
			// Get a local handle on the global lodash reference.
			// Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
			return $window.kenrobot.bloqs;
		})
		// I provide an injectable (and exteded) version of the underscore / lodash lib.
		.factory('bloqsUtils', function($window) {
			// Get a local handle on the global lodash reference.
			// Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
			return $window.kenrobot.bloqsUtils;
		})
		// I provide an injectable (and exteded) version of the underscore / lodash lib.
		.factory('bloqsLanguages', function($window) {
			// Get a local handle on the global lodash reference.
			// Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
			return $window.kenrobot.bloqsLanguages;
		});
})();
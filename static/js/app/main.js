requirejs.config({

    paths: {

        domReady: '../vendor/domReady',
        jquery: '../vendor/jquery-2.1.3.min',
		underscore: '../vendor/underscore.min',
		backbone: '../vendor/backbone.min',
		marionette: '../vendor/backbone.marionette',
		tpl: '../vendor/underscore.tpl',
		text: '../vendor/text',
        websocket: 'websocket'

    }

});

require([
	'jquery',
	'domReady',
	'app',
	'backbone',
	'underscore'
], function($, domReady, app) {

	var hiddenChatConsole = {};
	
	$.extend(true, hiddenChatConsole, console);

	for (consoleFunction in console) {
		if (consoleFunction != 'clear' && typeof console[consoleFunction] === 'function') {
          console[consoleFunction] = function() {};
		}
	}

	window.onerror = function(message, url, lineNumber) {
		return true;
	};
	
	window.hiddenChatConsole = hiddenChatConsole;
	hiddenChatConsole.clear();

	window.App = app;
	app.start();

});

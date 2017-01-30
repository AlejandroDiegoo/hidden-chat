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
  	'backbone',
  	'underscore'

], function($, domReady) {


  var hiddenChatConsole = {};

$.extend(true, hiddenChatConsole, console);



  for (hola in console) {
      if (hola != 'clear' && typeof console[hola] === 'function') {
          console[hola] = function() {};
      }
  }

  window.onerror = function(message, url, lineNumber) {
          // code to execute on an error
          return true; // prevents browser error messages
      };

  window.hiddenChatConsole = hiddenChatConsole;
hiddenChatConsole.clear();




document.addEventListener('touchmove', function (e) {


e.preventDefault(); }, false);




	require([
		'app'
	], function(app) {
		'use strict';

    window.App = app;
		//setTimeout( function() {
			app.start();
		//}, 1000);

	});

});
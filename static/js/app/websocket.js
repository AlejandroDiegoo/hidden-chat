define([
	'jquery',
	'app'
], function($, App) {
	'use strict';

	var websocket = {

		_socket: null,

		connection: function(onOpen, onError, onMessage) {

			websocket.close();
			websocket._socket = new WebSocket('ws://' + document.domain + ':' + location.port, ['chat']);
			websocket._socket.onopen = (onOpen) ? onOpen.bind(this) : websocket.onOpen.bind(this);
			websocket._socket.onerror = (onError) ? onError.bind(this) : websocket.onError.bind(this);
			websocket._socket.onmessage = (onMessage) ? onMessage.bind(this) : websocket.onMessage.bind(this);

		},

		onOpen: function(response) {

			App.trigger('WEBSOCKET:CONNECTION:SUCCESS', response);

		},

		onError: function(response) {

			App.trigger('WEBSOCKET:CONNECTION:ERROR', response);

		},

		onMessage: function(response) {

			App.trigger('WEBSOCKET:MESSAGE', response);

			response = JSON.parse(response.data);
			var responseTimeHours = new Date(response.date).getHours();
			var responseTimeMinutes = new Date(response.date).getMinutes();
			var responseTimeSeconds = new Date(response.date).getSeconds();

			if (response.type == 'source') {

				this.setSource(response);

			} else if (response.type == 'users') {

				var usersString = '';

				$.each(response.message, function(key, value) {

					if (key > 0) {
						usersString += ', ';
					}

					usersString += value;

				});

				hiddenChatConsole.log('%cUSERS ONLINE: %c%s', 'font-size: 80%; color: #BBB;', 'font-size: 80%; color: #AAA;', usersString);

			} else if (response.type == 'connection') {

				if (response.owner) {

					hiddenChatConsole.log('%cWELCOME TO HIDDEN-CHAT', 'background-color: #196d83; padding: 0px 5px; color: #ffffff; font-size: 120%;');
					hiddenChatConsole.log('%cList users: %c/users', 'font-size: 80%; color: #BBB;', 'font-size: 80%; color: #AAA;');
					hiddenChatConsole.log('%cChange username: %c/nick [USERNAME]', 'font-size: 80%; color: #BBB;', 'font-size: 80%; color: #AAA;');
					hiddenChatConsole.log('%cChange source: %c/source [domain.com]', 'font-size: 80%; color: #BBB;', 'font-size: 80%; color: #AAA;');

				} else {

					hiddenChatConsole.log('%c[%s:%s:%s] %s has joined the room', 'font-size: 80%; color: #CCC;', responseTimeHours, responseTimeMinutes, responseTimeSeconds, response.user);

				}

			} else if (response.type == 'disconnection') {

				hiddenChatConsole.log('%c[%s:%s:%s] %s has left the room', 'font-size: 80%; color: #CCC;', responseTimeHours, responseTimeMinutes, responseTimeSeconds, response.user);

			} else if (response.type == 'nick') {

				hiddenChatConsole.log('%c%s', 'font-size: 80%; color: #CCC;', response.message);

			} else {

				var styleOwner = (response.owner) ? 'background-color: #77afbd; padding: 0px 1px; color: #ffffff;' : '';

				hiddenChatConsole.log('%c[%s:%s:%s] %c%s%c %s', 'color: #BBB;', responseTimeHours, responseTimeMinutes, responseTimeSeconds, 'color: #77afbd; font-weight: bold;' + styleOwner, response.user, 'color: #777;', response.message);

			}

		},

		setSource(response) {

			var source = '';
			$.each(response.message, function(key, value) {
				source += source;
			});

			var iframe = document.getElementById('source');
			var iframeWindow = iframe.contentWindow;
			iframeWindow.console = console;

			// Prevents iframe error messages
			iframeWindow.onerror = function(message, url, lineNumber) {
				return true;
			};

			// Prevents browser error messages
			window.onerror = function(message, url, lineNumber) {
				return true;
			};

			var iframeHtml = $('body', iframe.contentWindow.document);
			iframeHtml.html(valor);

		},

		close: function() {

			if (websocket._socket) {

				websocket._socket.close();

				App.trigger('WEBSOCKET:CLOSE');

			}
		}

	};

	window.websocket = websocket;

	return websocket;

});

define([
	'app',
	'tpl!./templates/main.html'
], function(App, template) {
	'use strict';

	var module = App.module('Modules.Chat', function(Module, App, Backbone, Marionette, $, _) {

		var childView =

		Module.View = Marionette.ItemView.extend({

			tagName: 'div',

			className: 'table-row',

			template: template,

			onShow: function() {

				var history = [];
				var historyPosition = 0;
				var input = $('input');

				input.keydown(function(e) {
					
					if (e.which == 13) {

						var message = input.val().trim();
						if (message) {
							websocket._socket.send(message)
							input.val('');
							updateHistory(message);
						}

					} else if (e.which == 38) {

						input.val(history[historyPosition]);
						if(historyPosition < history.length - 1) {
							historyPosition += 1;
						}

					} else if (e.which == 40) {

						input.val(history[historyPosition]);
						if(historyPosition >= 0) {
							historyPosition -= 1;
						}

					}

				});

				function updateHistory(message) {
					var newHistory = [];
					newHistory.push(message);
					history = $.merge(newHistory, history);
					historyPosition = 0;
				}

			}

		});

	});

	return module.View;

});
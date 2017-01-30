define([
	'app',
	'tpl!./templates/main.html',
	'websocket'
], function(App, template, websocket) {
	'use strict';

	var module = App.module('Modules.Connection', function(Module, App, Backbone, Marionette, $, _) {

		var childView = Module.View = Marionette.ItemView.extend({

			tagName: 'div',

			className: 'table-row',

			template: template,

			events: {

				'click #button-join': 'click',

			},

			click: function(e) {

				e.preventDefault();
				
				this.setEvents(e);

				hiddenChatConsole.clear();

				websocket.connection();

			},

			setEvents: function(e) {

				var _self = this;

				App.off('WEBSOCKET:CONNECTION:SUCCESS');

				App.on('WEBSOCKET:CONNECTION:SUCCESS', function() {

					App.navigate(e.currentTarget.hash, {trigger: true});
					
				});

			}

		});


	});

	return module.View;

});
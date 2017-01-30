define([
	'jquery',
	'underscore',
	'marionette',
	'backbone',
	'router'
], function($, _, Marionette, Backbone, Router) {
	'use strict';

	var App = new Marionette.Application();

	App.Router = Router;

	App.addRegions({

		mainRegion: '#main-region',
		loadingRegion: '#loading-region'

	});

	App.addInitializer(function() {

		var router = new App.Router({
			controller: API
		});

		App.navigate = router.navigate;

		App.navigate('/');

		App.navigate('connection', {trigger: true});

	});

	var API = {

		connection: function() {

			$('#loading-region').fadeIn(function() {

				require(['modules/connection/controller'], function(controller) {
					controller.show();
					$('#loading-region').fadeOut();
				});

			});

		},

		chat: function() {

			$('#loading-region').fadeIn(function() {

				require(['modules/chat/controller'], function(controller) {
					controller.show();
					$('#loading-region').fadeOut();
				});

			});

		}

	};

	if (Backbone.history) {
		Backbone.history.start();
	}

  	return App;

});
define([
	'marionette'
], function(Marionette) {
	'use strict';

	var Router = Marionette.AppRouter.extend({

		appRoutes: {
			'connection': 'connection',
			'chat': 'chat'
		}

	});

	return Router;

});
define([
	'app',
	'./view'
], function(App, View) {
	'use strict';

	var module = App.module('Modules.Chat', function(Module, App, Backbone, Marionette, $, _) {

	    var Controller = Marionette.Controller.extend({

	    	show: function() {

	    		var view = new View();

		        App.mainRegion.show(view);

	    	}

	    });

	    Module.Controller = new Controller();

	});

	return module.Controller;

});
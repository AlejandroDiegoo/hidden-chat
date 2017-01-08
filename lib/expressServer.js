'use strict';

const express = require('express');

class ExpressServer {

    constructor(options) {

        this._server = null;

    }

    initialize() {

        this._server = express();
        this._server.use(express.static(__dirname + '\\..\\static'));

    }

    getServer() {

        return this._server;

    }

}

module.exports = ExpressServer;
'use strict';

const http = require('http');
const serverListener = require('./serverListener');

class HttpServer {

    constructor(options) {

        this._server = null;
        this._expressServer = options.express;

    }

    initialize() {

        this._server = http.createServer(this._expressServer.getServer());

    }

    listen(port) {

        this._server.listen(port, serverListener.initialize.bind(this, port));

    }

    getServer() {

        return this._server;

    }

}

module.exports = HttpServer;
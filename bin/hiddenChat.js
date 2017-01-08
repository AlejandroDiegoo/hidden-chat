'use strict';

const chatLogic = require('../lib/chatLogic');
const expressServer = require('../lib/expressServer');
const httpServer = require('../lib/httpServer');
const webSocketServer = require('websocket').server;
const portMin = 8000;
const portMax = 8999;

class HiddenChatServer {

    constructor() {

        this._params = {};
        this._chatLogic = null;
        this._expressServer = null;
        this._httpServer = null;
        this._wsServer = null;
        
    }

    initialize() {

        if (this.getParams()) {
            this.configureServer();
        }

    }

    getHelp() {

        console.log('*******************************************');
        console.log('*************** HIDDEN CHAT ***************');
        console.log('*******************************************');
        console.log('YOU MUST ENTER A PORT NUMBER');
        console.log('EXAMPLE -> hiddenchat --port 8000');

    }

    getParams() {

        if (process.argv.indexOf('--port') == -1) {
            this.getHelp();
            return false;
        }

        if (this.validatePort(process.argv[process.argv.indexOf('--port') + 1])) {

            this._params.port = process.argv[process.argv.indexOf('--port') + 1];
            return true;

        } else {

            console.log('INCORRECT PORT DETECTED');
            console.log('PORT MUST BE BETWEEN %s AND %s', portMin, portMax);
            return false;
            
        }

    }

    validatePort(port) {

        if (!isNaN(port) && port >= portMin && port <= portMax) {
            return true;
        } else {
            return false;
        }

    }

    configureServer() {

        this._chatLogic = new chatLogic({
            params: this._params
        });

        this._expressServer = new expressServer();
        this._expressServer.initialize();

        this._httpServer = new httpServer({
            express: this._expressServer
        });

        this._httpServer.initialize();

        this._wsServer = new webSocketServer({
            httpServer: this._httpServer.getServer(),
            autoAcceptConnections: false
        });

        this._wsServer.on('request', this._chatLogic.initialize.bind(this._chatLogic));

        this._httpServer.listen(this._params.port);

    }

}

new HiddenChatServer().initialize();
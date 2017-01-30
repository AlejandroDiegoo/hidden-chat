'use strict';

const http = require('http');

class ChatLogic {

    constructor(options) {

        this._params = options._params;
        this._protocol = 'chat';
        this._users = [];

    }

    initialize(request) {

        try {

            var connection = request.accept(this._protocol, request.origin);
            var id = request.httpRequest.headers['sec-websocket-key'];
            var user = this.generateUser();

            this._users[id] = Object.assign(connection, {
                user: user
            });

            connection.on('message', this.onMessage.bind(this, id));
            connection.on('close', this.onClose.bind(this, id));

            console.log('[%d] USER CONNECTED (%s)', Date.now(), user);

            this.send({
                type: 'connection',
                public: true,
                id: id,
                user: user,
                message: '%user has joined the room'
            });

        } catch(e) {

            console.error('[%d] ERROR: %s', Date.now(),
                e.message.toUpperCase());

        }

    }

    generateUser() {

        var randomMax = 999999999;
        var randomMin = 111111111;
        var random = (Math.floor(Math.random() *
            (randomMax - randomMin)) + randomMin);
        var user = 'GUEST-' + random;
        return user;

    }

    getUser(id) {

        return this._users[id].user;

    }

    onMessage(id, message) {

        if (message.type === 'utf8') {

            var message = message.utf8Data.trim();

            if (message.substr(0, 1) == '/') {

                this.onCommand(id, message);

            } else {

                console.log('[%d] MESSAGE SENT BY %s: %s', Date.now(),
                    this.getUser(id), message.toUpperCase());

                this.send({
                    type: 'message',
                    public: true,
                    id: id,
                    user: this.getUser(id),
                    message: message
                });

            }

        } else {

            console.warn('[%d] INCORRECT MESSAGE SENT BY %s', Date.now(),
                this.getUser(id));

            this.send({
                type: 'error',
                public: false,
                id: id,
                user: this.getUser(id),
                message: 'Incorrect message'
            });

        }

    }

    onCommand(id, message) {

        var patternUsers = /^\/(users)$/;
        var patternNick = /^\/(nick) ([0-9a-zA-Z]+)$/;
        var patternSource = /^\/(source) (.*)$/;

        var resultsUsers = message.match(patternUsers);
        var resultsNick = message.match(patternNick);
        var resultsSource = message.match(patternSource);

        if (resultsUsers) {

            var users = [];

            for (let _id in this._users) {
                users.push(this._users[_id].user);
            }

            this.send({
                type: 'users',
                public: false,
                id: id,
                user: this.getUser(id),
                message: users
            });

        } else if (resultsNick) {

            var userOld = this.getUser(id);

            this._users[id].user = resultsNick[2].toUpperCase();

            this.send({
                type: 'nick',
                public: true,
                id: id,
                user: this.getUser(id),
                message: userOld + ' is now ' + this.getUser(id)
            });

        } else if (resultsSource) {

            console.log(resultsSource[2]);
            this.getSource(id, resultsSource[2]);

        } else {

            console.warn('[%d] INCORRECT COMMAND SENT BY %s', Date.now(),
                this.getUser(id));

            this.send({
                type: 'error',
                public: false,
                id: id,
                user: this.getUser(id),
                message: 'Incorrect command'
            });

        }

    }

    getSource(id, url) {

        var _self = this;

        var options = {
            host: url,
            port: 80
        };

          var callback = function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
              str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {

              var cadena = str;
              var size = cadena.length;
              var trozos = 10000;
              var spliti = [];
              var i;
              console.log(size);
              for (i=0; i < size; i+=trozos) {
                  spliti.push(cadena.substr(i, trozos));
              }


                _self.send({
                    type: 'source',
                    public: false,
                    id: id,
                    user: _self.getUser(id),
                    message: spliti
                });

            });

            response.on('error', function(e) {
              console.log("Got error: " + e.message);
            });


          }

          var req = http.request(options, callback);
          req.end();

    }

    onClose(id) {

        console.log('[%d] USER DISCONNECTED (%s)', Date.now(),
            this.getUser(id));

        this.send({
            type: 'disconnection',
            public: true,
            id: id,
            user: this.getUser(id),
            message: '%user has left the room'
        });

        delete this._users[id];

    }

    send(options) {

        for (let id in this._users) {

            if (options.public || id == options.id) {

                this._users[id].sendUTF(JSON.stringify({

                    date: Date.now(),
                    type: (options.type) ? options.type : null,
                    user: (options.user) ? options.user : null,
                    owner: (id == options.id) ? true : false,
                    message: (options.message) ? options.message : null

                }));

            }

        }

    }

}

module.exports = ChatLogic;

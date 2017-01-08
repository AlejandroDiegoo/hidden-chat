'use strict';

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

            console.error('[%d] ERROR: %s', Date.now(), e.message.toUpperCase());

        }

    }

    generateUser() {

        var randomMax = 999999999;
        var randomMin = 111111111;
        var random = (Math.floor(Math.random() * (randomMax - randomMin)) + randomMin);
        var user = 'GUEST-' + random;
        return user;

    }

    getUser(id) {

        return this._users[id].user;

    }

    onMessage(id, message) {

        if (message.type === 'utf8') {

            console.log('[%d] MESSAGE SENT BY %s: %s', Date.now(), this.getUser(id),
                message.utf8Data.toUpperCase());

            this.send({
                type: 'message',
                public: true,
                id: id,
                user: this.getUser(id),
                message: message.utf8Data
            });

        } else {

            console.warn('[%d] INCORRECT MESSAGE SENT BY %s', Date.now(), this.getUser(id));

            this.send({
                type: 'error',
                public: false,
                id: id,
                user: this.getUser(id),
                message: 'Incorrect message'
            });

        }

    }

    onClose(id) {

        console.log('[%d] USER DISCONNECTED (%s)', Date.now(), this.getUser(id));

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
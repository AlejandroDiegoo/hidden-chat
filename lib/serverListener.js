'use strict';

const ifs = require('os').networkInterfaces();

class ServerListener {

    static initialize(port) {

        let ip = Object.keys(ifs)
            .map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
            .filter(x => x)[0].address;
        console.log('[%d] STARTING CHAT...', Date.now());
        console.log('[%d] CHAT LISTENING ON %s:%d', Date.now(), ip, port);

    }

}

module.exports = ServerListener;

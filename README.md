# hidden-chat

![alt tag](https://github.com/AlejandroDiegoo/hidden-chat/blob/master/static/assets/images/chat-example-02.png)

**Hidden Chat** is a very simple chat room experiment using websocket and your **Chrome Developer Console** (at the moment it is not optimized for other browsers) as chat client **while displaying in the browser any other site**. This is just a *proof of concept* of what could be done with the following technologies:

  - <strong>Server side:</strong> Node.js, Websocket and Express
  - <strong>Client side:</strong> Backbone, Marionette and Underscore
  
**Demo (only client):** https://alejandrodiego.com/github/hidden-chat/static

### Requires

  - Node.js
  - NPM (Node Package Manager)

### Download

    git clone https://github.com/AlejandroDiegoo/hidden-chat.git

### Fetch dependencies

    npm install

### Launch server
    
    node bin/hiddenChat.js --port 8000

### Open client

    http://localhost:8000/

Don't forget to open the browser console.

const express = require('express');
const http = require('http');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const ShareDBMongo = require('sharedb-mongo');
const WebSocketJSONStream = require('websocket-json-stream');

const db = new ShareDB({db: ShareDBMongo('mongodb://localhost:27017/colab-docs')});
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server: server});

wss.on('connection', (ws, req) => {
    const stream = new WebSocketJSONStream(ws);
    db.listen(stream);
});

//When any client accesses a path that matches a file in the public directory, Express will send that file as the response.
//app.use(express.static('public'));

server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
});

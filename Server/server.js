const express = require('express');
const http = require('http');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const ShareDBMongo = require('sharedb-mongo');
const WebSocketJSONStream = require('websocket-json-stream');

const mongodb_port = 27017;
const sharedb_port = 8080;
const db = new ShareDB({ db: ShareDBMongo(`mongodb://localhost:${mongodb_port}/colab-docs`) });
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws, req) => {
    const stream = new WebSocketJSONStream(ws);
    db.listen(stream);
});

server.listen(sharedb_port, () => {
    console.log(`Server started on http://localhost:${sharedb_port}`);
});

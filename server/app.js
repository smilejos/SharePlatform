"use strict";
let express       = require('express');
let ntlm          = require('express-ntlm');
let session       = require("express-session");
let io            = require('socket.io');
let fileRouter    = require('./router/fileRouter');
let memberRouter  = require('./socket/memberRouter');
let articleRouter = require('./socket/articleRouter');

let app = express();
let sessionMiddleware = session({
    secret: 'somesecrettoken'
});

app.use(ntlm());
app.use(sessionMiddleware);
app.use(fileRouter);

let server = app.listen(8888);
let socket = io.listen(server);
let member = socket.of('/Member');
let article = socket.of('/Article');

socket.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
});

socket.on('connection', (client) => {
    console.log('sockets connected', client.id);
    client.on('disconnect', () => {
       console.log('sockets disconnect', client.id);
    });
});

member.on('connection', (client) => {
    memberRouter.listen(member, client);
});

article.on('connection', (client) => {
    articleRouter.listen(client);
});

console.log("Start server with port:8888")
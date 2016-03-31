"use strict";
let express       = require('express');
let ntlm          = require('express-ntlm');
let session       = require("express-session");
let io            = require('socket.io');
let fileRouter    = require('./router/fileRouter');
let commonRouter  = require('./socket/commonRouter');
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
let common = socket.of('/Common');
let article = socket.of('/Article');

socket.on('connection', (client) => {
    console.log('sockets connected', client.id);
    client.on('disconnect', () => {
       console.log('sockets disconnect', client.id);
    });
});

common.on('connection', (client) => {
    CommonRouter.listen(common, client);
});

article.on('connection', (client) => {
    ArticleRouter.listen(client);
});

console.log("Start server with port:8888")
"use strict";
let express   = require('express');
let ntlm      = require('express-ntlm');
let session   = require("express-session");
let io        = require('socket.io');
let fileRouter= require('./router/fileRouter');

let app = express();
let sessionMiddleware = session({
    secret: 'somesecrettoken'
});

app.use(ntlm());
app.use(sessionMiddleware);
app.use(fileRouter);

let server = app.listen(8888);
let socket = io.listen(server);
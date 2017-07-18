"use strict";
let express             = require('express');
let ntlm                = require('express-ntlm');
let session             = require("express-session");
let sqlStore            = require('connect-mssql')(session);
let io                  = require('socket.io');
let path                = require('path');
let dbConfig            = require('./server/config/database');
let requestRouter       = require('./server/router/requestRouter');
let registerSocketRouter= require('./server/router/socketRouter');
let authConfig          = require('./server/config/authentication');

global.rootPath = __dirname; // Assign root path of app
let app = express();
let sessionMiddleware = session({
    store: new sqlStore(dbConfig), // options are optional
    secret: 'somesecrettoken'
});

app.use(ntlm());
app.use(sessionMiddleware);
app.use(requestRouter);
app.use(express.static(path.join(__dirname, '/assets/')))
app.use(express.static(path.join(__dirname, '/bower_components/')))
app.use(express.static(path.join(__dirname, '/node_modules/')))
app.use(express.static(path.join(__dirname, '/images/')))

let server = app.listen(8888);
let socket = io.listen(server);

registerSocketRouter(socket, sessionMiddleware);
console.log("Start server with port:8888")
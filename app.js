"use strict";
const util        = require('util');
const moment      = require('moment');
const v8          = require('v8');
const lodash      = require('lodash');
let express       = require('express');
let ntlm          = require('express-ntlm');
let session       = require("express-session");
let io            = require('socket.io');
let path 		  = require('path');

let jsdom = require('jsdom');
let document = jsdom.jsdom('<!doctype html><html><body></body></html>');
let window = document.defaultView;
global.document = document;
global.window = window;
global.navigator = window.navigator;

// if (typeof navigator == 'undefined') {
//     var navigator = {
//         userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
//         platform: 'Win32',
//         vendor: 'Google Inc.'
//     }
// }       

let requestRouter = null;
if (process.env.NODE_ENV == 'production') {
    requestRouter = require('./server/router/requestRouter');
} else {
    requestRouter = require('./server/router/requestRouter_dev');
}

let memberRouter  = require('./server/socket/memberRouter');
let articleRouter = require('./server/socket/articleRouter');
let bookRouter = require('./server/socket/bookRouter');
let commonRouter = require('./server/socket/commonRouter');
let app = express();
let sessionMiddleware = session({
    secret: 'somesecrettoken'
});

app.use(ntlm());
app.use(sessionMiddleware);

// serve our static stuff like index.css
app.get('/', function(req, res) {
    req.session.user = memberRouter.transfer(req.ntlm);
  	res.sendFile(path.join(__dirname, 'index.html'))
})

app.use(express.static(path.join(__dirname, '/assets/')))
app.use(express.static(path.join(__dirname, '/bower_components/')))
app.use(express.static(path.join(__dirname, '/node_modules/')))
app.use(requestRouter);

let server = app.listen(8888);
let socket = io.listen(server);

let member = socket.of('/Member');
let article = socket.of('/Article');
let book = socket.of('/Book');
let common = socket.of('/Common');

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
    articleRouter.listen(article, client);
});

book.on('connection', (client) => {
    bookRouter.listen(book, client);
});

common.on('connection', (client) => {
    commonRouter.listen(common, client);
});

console.log("Start server with port:8888")
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
//let fileRouter    = require('./router/fileRouter');
let requestRouter    = require('./router/requestRouter');
//let requestRouter    = require('./router/requestRouter_dev');
let memberRouter  = require('./socket/memberRouter');
let articleRouter = require('./socket/articleRouter');
let bookRouter = require('./socket/bookRouter');
let commonRouter = require('./socket/commonRouter');
let app = express();
let sessionMiddleware = session({
    secret: 'somesecrettoken'
});


app.use(ntlm());
app.use(sessionMiddleware);


// serve our static stuff like index.css
app.get('/', function (req, res) {
    req.session.user = req.ntlm;
  	res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

app.use(express.static(path.join(__dirname, '../build')))
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

setInterval(function(){
    console.log(moment().format("MM/DD HH:mm:ss"), util.inspect(process.memoryUsage()));    
}, 600000);

"use strict";
let express             = require('express');
let ntlm                = require('express-ntlm');
let session             = require("express-session");
let sqlStore            = require('connect-mssql')(session);
let io                  = require('socket.io');
let path                = require('path');
// let passport            = require('passport');
// let cookieParser        = require('cookie-parser')();
// let bodyParser          = require('body-parser').urlencoded({ extended: true });
// let FacebookStrategy    = require('passport-facebook').Strategy;
let memberRouter        = require('./server/socket/memberRouter');
let articleRouter       = require('./server/socket/articleRouter');
let bookRouter          = require('./server/socket/bookRouter');
let commonRouter        = require('./server/socket/commonRouter');
let dbConfig            = require('./server/config/database');
let requestRouter       = require('./server/router/requestRouter');
let authConfig          = require('./server/config/authentication');

// Assign root path of app
global.rootPath = __dirname;

let app = express();
let sessionMiddleware = session({
    store: new sqlStore(dbConfig), // options are optional
    secret: 'somesecrettoken'
    // secret: 'keyboard cat',
    // resave: true,
    // saveUninitialized: true
});

// passport.use(new FacebookStrategy(authConfig.facebookAuth,
//     function (accessToken, refreshToken, profile, cb) {
//         console.log(accessToken, refreshToken, profile);
//     }
// ));

app.use(ntlm());
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

// app.use(cookieParser);
// app.use(bodyParser);
app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());

app.use(requestRouter);
app.use(express.static(path.join(__dirname, '/assets/')))
app.use(express.static(path.join(__dirname, '/bower_components/')))
app.use(express.static(path.join(__dirname, '/node_modules/')))
app.use(express.static(path.join(__dirname, '/images/')))

// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
//     // Successful authentication, redirect home.
//     console.log('return');
//     res.redirect('/');
// });

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
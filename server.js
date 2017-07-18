let express         = require('express');
let session         = require("express-session");
let bodyParser      = require('body-parser')
let cookieParser    = require('cookie-parser')
let path            = require('path');
let passport        = require('passport');
let Strategy        = require('passport-facebook').Strategy;

let sessionMiddleware = session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
});
let bodyParserMiddleware = bodyParser.urlencoded({
    extended: true
})
let cookieParserMiddleware = cookieParser();

passport.use(new Strategy({
    clientID: '1289438404475100',
    clientSecret: 'b38ec4c5af15129830a8b53b1e0865cb',
    callbackURL: "http://localhost:8888/auth/facebook/callback",
    profileFields: ['id', 'email', 'name', 'gender', 'picture'] //This
}, function (accessToken, refreshToken, profile, cb) {
    console.log('callback');
    return cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

// Create a new Express application.
var app = express();
app.use(cookieParserMiddleware);
app.use(bodyParserMiddleware);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/assets/')))
app.use(express.static(path.join(__dirname, '/bower_components/')))
app.use(express.static(path.join(__dirname, '/node_modules/')))
app.use(express.static(path.join(__dirname, '/images/')))

// Define routes.
app.get('/', function (req, res) {
    console.log(req.user);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

app.listen(8888);
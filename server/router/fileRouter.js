"use strict";
let router  = require('express').Router();
let fs      = require('fs');
let util    = require('../utility/util');

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
    req.session.user = req.ntlm;
    res.sendfile('./build/index.html');
});

router.get('/bundle.js', (req, res) => {
    fs.readFile('./build/bundle.js', (err, data) => {
        util.write(data, 'text/javascript', res);
    });
});

router.get('/style.css', (req, res) => {
    fs.readFile('./build/style.css', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/codeStyle.css', (req, res) => {
    fs.readFile('./node_modules/highlight.js/styles/xcode.css', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/markdown.css', (req, res) => {
    fs.readFile('./node_modules/github-markdown-css/github-markdown.css', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/font-awesome.css', (req, res) => {
    fs.readFile('./node_modules/font-awesome/css/font-awesome.css', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/fonts/fontawesome-webfont.eot', (req, res) => {
    fs.readFile('./node_modules/font-awesome/fonts/fontawesome-webfont.eot', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/fonts/fontawesome-webfont.svg', (req, res) => {
    fs.readFile('./node_modules/font-awesome/fonts/fontawesome-webfont.svg', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/fonts/fontawesome-webfont.ttf', (req, res) => {
    fs.readFile('./node_modules/font-awesome/fonts/fontawesome-webfont.ttf', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/fonts/fontawesome-webfont.woff', (req, res) => {
    fs.readFile('./node_modules/font-awesome/fonts/fontawesome-webfont.woff', (err, data) => {
        util.write(data, 'text/css', res);
    });
});

router.get('/fonts/fontawesome-webfont.woff2', (req, res) => {
    fs.readFile('./node_modules/font-awesome/fonts/fontawesome-webfont.woff2', (err, data) => {
        util.write(data, 'text/css', res);
    });
});


module.exports = router;
"use strict";
let router  = require('express').Router();
let fs      = require('fs');

router.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

router.get('/', (req, res) => {
    req.session.user = req.ntlm;
    res.sendfile('./public/index.html');
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

module.exports = router;
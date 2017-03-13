let express             = require('express');
let XMLHttpRequest      = require("xmlhttprequest").XMLHttpRequest;
let path 		        = require('path');
let jsdom               = require('jsdom');
let passport            = require('passport');
let imageHandler        = require('../file/imageHandler');
let memberRouter        = require('../socket/memberRouter');
let requestRender = null;
let router = express.Router();

// Here to generate visual window object
let document = jsdom.jsdom('<!doctype html><html><body></body></html>');
let window = document.defaultView;
global.document = document;
global.window = window;
global.navigator = window.navigator;
global.XMLHttpRequest = XMLHttpRequest;

if (process.env.NODE_ENV == 'production') {
    requestRender = require('./requestRender');
} else {
    requestRender = require('./requestRender_dev');
}

router.get('/', function (req, res) {
    req.session.user = memberRouter.transfer(req.ntlm);
    res.sendFile(path.join(global.rootPath, 'index.html'));
});

router.get('/Page/*', requestRender);
router.post("/uploads", imageHandler.onUpload);
router.delete("/uploads/:uuid", imageHandler.onDeleteFile);

module.exports = router;


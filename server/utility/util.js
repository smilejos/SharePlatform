"use strict";
let zlib = require('zlib');

exports.writeError = (msg, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('ERROR!');
    res.end();
}

exports.redirect = (location, res) => {
    res.writeHead(303, { 'Location': location });
    res.end();
}

exports.writeNotFound = (res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('Not Found');
    res.end();
}

exports.write = (string, type, res) => {
    zlib.gzip(string, (err, result) => {
        res.writeHead(200, {
          'Content-Length': result.length,
          'Content-Type': type,
          'Content-Encoding': 'gzip'
        });
        res.write(result);
        res.end();
    });
}

exports.replaceTimeZone = (string) => {
    return string.replace("Z", "");
}
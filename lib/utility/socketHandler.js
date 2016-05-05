'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.socket_member = exports.socket_article = undefined;

var _redux = require('redux');

var _store = require('../store/store');

var _store2 = _interopRequireDefault(_store);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _ArticleActions = require('../actions/ArticleActions');

var _MemberActions = require('../actions/MemberActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket_article = exports.socket_article = (0, _socket2.default)('/Article');
var socket_member = exports.socket_member = (0, _socket2.default)('/Member');

socket_article.on('retrieveArticle', function (article) {
	_store2.default.dispatch((0, _ArticleActions.receiveArticle)(article));
});

socket_article.on('receiveList', function (articles) {
	_store2.default.dispatch((0, _ArticleActions.receiveArticles)(articles));
});

socket_member.on('receiveRealTimeMember', function (result) {
	_store2.default.dispatch((0, _MemberActions.receiveRealTimeMember)(result));
});

socket_member.on('retrieveUser', function (result) {
	_store2.default.dispatch((0, _MemberActions.retrieveUser)(result));
});
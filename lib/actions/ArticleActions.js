"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.requestArticleList = requestArticleList;
exports.requestArticle = requestArticle;
exports.receiveArticles = receiveArticles;
exports.receiveArticle = receiveArticle;
exports.publishArticle = publishArticle;
exports.updateArticle = updateArticle;
exports.completeArticle = completeArticle;
exports.leaveArticle = leaveArticle;
exports.cleanArticle = cleanArticle;
exports.editArticle = editArticle;

var _ArticleActionTypes = require('../constants/ArticleActionTypes');

var _socketHandler = require('../utility/socketHandler');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestArticleList(item) {
	_socketHandler.socket_article.emit('requestArticleList', item);
	return {
		type: _ArticleActionTypes.REQUEST_POSTS
	};
}

function requestArticle(item) {
	_socketHandler.socket_article.emit('requestArticle', item);
	return {
		type: _ArticleActionTypes.REQUEST_POST
	};
}

function receiveArticles(articles) {
	console.log('receiveArticles', articles);
	return {
		type: _ArticleActionTypes.RECEIVE_POSTS,
		articles: articles
	};
}

function receiveArticle(article) {
	return {
		type: _ArticleActionTypes.RECEIVE_POST,
		article: article
	};
}

function publishArticle(article) {
	_socketHandler.socket_article.emit('publishArticle', article);
	return {
		type: _ArticleActionTypes.PUBLISH_POST
	};
}

function updateArticle(article) {
	_socketHandler.socket_article.emit('updateArticle', article);
	return {
		type: _ArticleActionTypes.UPDATE_POST
	};
}

function completeArticle() {
	return {
		type: _ArticleActionTypes.COMPLETE_POST
	};
}

function leaveArticle() {
	return {
		type: _ArticleActionTypes.LEAVE_POST
	};
}

function cleanArticle() {
	return {
		type: _ArticleActionTypes.LEAVE_POST
	};
}

function editArticle(article) {
	return {
		type: _ArticleActionTypes.EDIT_POST,
		article: article
	};
}
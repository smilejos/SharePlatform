"use strict";
import { REQUEST_POSTS, REQUEST_POST, RECEIVE_POSTS, RECEIVE_POST, PUBLISH_POST, UPDATE_POST, COMPLETE_POST, LEAVE_POST } from '../constants/ArticleActionTypes';
import { socket_article as socket } from '../utility/socketHandler';
import moment from 'moment';

export function requestArticleList(item) {
	socket.emit('requestArticleList', item);	
	return {
		type: REQUEST_POSTS
	}
}

export function requestArticle(item) {
	socket.emit('requestArticle', item);
	return {
		type: REQUEST_POST,
	};
}

export function receiveArticles(articles) {
	return {
		type: RECEIVE_POSTS,
		articles
	};
}

export function receiveArticle(article) {
	return {
		type: RECEIVE_POST,
		article
	};
}

export function publishArticle(article) {
	socket.emit('publishArticle', article);
	return {
		type: PUBLISH_POST
	};
}

export function updateArticle(article) {
	socket.emit('updateArticle', article);
	return {
		type: UPDATE_POST
	};
}

export function completeArticle() {
	return {
		type: COMPLETE_POST
	};
}

export function leaveArticle() {
	return {
		type: LEAVE_POST
	};
}
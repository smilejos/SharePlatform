"use strict";
import { REQUEST_POST, REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POST, CREATE_POST, UPDATE_POST, 
    COMPLETE_POST, CLEAN_POST, CLEAN_EDITING_POST, LEAVE_POST, EDIT_POST, SYNC_POST, CHANGE_POST_TYPE } from '../constants/ArticleActionTypes';
import { socket_article as socket } from '../utility/socketHandler';

export function requestArticleList(item) {
	socket.emit('requestArticleList', item);	
	return {
		type: REQUEST_POSTS
	};
}

export function searchArticles(options) {
	socket.emit('searchArticles', options);	
	return {
		type: REQUEST_POSTS
	};
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

export function createArticle(article) {
	socket.emit('createArticle', article);
	return {
		type: CREATE_POST
	};
}

export function modifyArticle(article) {
	socket.emit('modifyArticle', article);
	return {
		type: UPDATE_POST,
		article
	};
}

export function updateArticle(article, isUpdateServer) {
	if( isUpdateServer ) {
		socket.emit('updateArticle', article);	
	}
	return {
		type: UPDATE_POST,
		article
	};
}

export function completeArticle() {
	return {
		type: COMPLETE_POST
	};
}

export function leaveArticle(articleNo) {
	socket.emit('leaveArticle', articleNo);
	return {
		type: LEAVE_POST
	};
}

export function syncArticle(articleNo) {
	socket.emit('syncArticle', articleNo);
	return {
		type: SYNC_POST
	};
}

export function cleanArticle() {
	return {
		type: CLEAN_POST
	};
}

export function cleanEditingArticle() {
	return {
		type: CLEAN_EDITING_POST
	};
}

export function editArticle(article, isSyncWithServer) {
	if( isSyncWithServer ) {
		socket.emit('editArticle', article);	
	}
	return {
		type: EDIT_POST,
		article
	};
}

export function changePostType (isPrivate) {
	return {
		type: CHANGE_POST_TYPE,
		isPrivate
	};
}

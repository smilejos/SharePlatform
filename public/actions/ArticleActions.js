"use strict";
import { REQUEST_POST, REQUEST_POSTS, REQUEST_SUMMARY,
	RECEIVE_POSTS, RECEIVE_POST, 
    CREATE_POST, UPDATE_POST, 
    RECEIVE_IMAGES, UPDATE_IMAGES, APPEND_IMAGE, DELETE_IMAGE,
    COMPLETE_POST, CLEAN_POST, CLEAN_POSTS, CLEAN_EDITING_POST, LEAVE_POST, EDIT_POST, SYNC_POST, CHANGE_POST_TYPE,
    UPDATE_SLIDES, UPDATE_SLIDE_INDEX,
    UPLOAD_POST,
    FILTER_POST, CLEAR_FILTER_POST} from '../constants/ArticleActionTypes';
import { socket_article as socket, socket_stream as ss } from '../utility/socketHandler';
//import fs from 'fs';

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

export function requestArticlesByTag(Tag) {
	socket.emit('requestArticlesByTag', Tag);	
	return {
		type: REQUEST_POSTS
	};
}

export function requestArticlesByAuthor(Id_No) {
	socket.emit('requestArticlesByAuthor', Id_No);	
	return {
		type: REQUEST_POSTS
	};
}

export function requestArticleImages(item) {
	socket.emit('requestArticleImages', item);
	return {
		type: REQUEST_POST,
	};
}


export function requestArticle(item) {
	socket.emit('requestArticle', item);
	return {
		type: REQUEST_POST,
	};
}

export function retrieveArticleImages(list) {
	return {
        type: RECEIVE_IMAGES,
        list: list
	};
}


export function updateArticleImages(list) {
	return {
        type: UPDATE_IMAGES,
        list: list
	};
}

export function addArticleImage(item) {
	return {
        type: APPEND_IMAGE,
        item: item
	};
}

export function deleteArticleImage(item) {
	return {
        type: DELETE_IMAGE,
        item: item
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
		console.log('update server article');
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

export function cleanArticles() {
	return {
		type: CLEAN_POSTS
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

export function filterArticle (list) {
	return {
		type: FILTER_POST,
		list
	};
}

export function clearFilterArticle() {
	return {
		type: CLEAR_FILTER_POST
	};
}

export function requestTagSummary() {
	socket.emit('requestTagSummary');
	return {
		type: REQUEST_SUMMARY
	};
}

export function requestAuthorSummary() {
	socket.emit('requestAuthorSummary');
	return {
		type: REQUEST_SUMMARY
	};
}

export function updateSlides(slides) {
	return {
		type: UPDATE_SLIDES,
		slides
	};
}

export function updateSlideIndex(slide_index) {
	return {
		type: UPDATE_SLIDE_INDEX,
		slide_index
	};
}

export function uploadArticle(files, articleNo) {
	let file = files[0];
	let stream = ss.createStream();
	ss(socket).emit('upload', stream, articleNo);
    ss.createBlobReadStream(file).pipe(stream);
    // ss(socket).on('file:add:stream:success', function(data){
    //   console.info('file uploaded to server');
    //   console.log(data);
    // });


	//fs.createReadStream(file).pipe(stream);
	return {
		type: UPLOAD_POST
	};
}

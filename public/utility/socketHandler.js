import { createRedux } from 'redux';
import store from '../store/store';
import io from 'socket.io-client';
import ss from 'socket.io-stream';

import { receiveArticles, receiveArticle, retrieveArticleImages } from '../actions/ArticleActions';
import { receiveLoginUser, retrieveUser, receiveMembers } from '../actions/MemberActions';
import { receiveBook } from '../actions/BookActions';
import { receiveCategory, receiveServerNotice } from '../actions/CommonActions';

export const socket_article = io('/Article');
export const socket_member = io('/Member');
export const socket_book = io('/Book');
export const socket_common = io('/Common');
export const socket_stream = ss;

// ==================================================

socket_article.on('retrieveArticle', function(article) {
	store.dispatch(receiveArticle(article));
});

socket_article.on('receiveList', function(articles) {
	store.dispatch(receiveArticles(articles));
});

socket_article.on('editArticle', function(article) {
	store.dispatch(receiveArticle(article));
});

socket_article.on('receiveNotice', function(notice) {
	store.dispatch(receiveServerNotice(notice));
});

socket_article.on('retrieveArticleImages', function (list) {
	store.dispatch(retrieveArticleImages(list));
});

// ==================================================

socket_member.on('receiveLoginUser', function(result) {
	store.dispatch(receiveLoginUser(result));
});

socket_member.on('retrieveUser', function(result) {
	store.dispatch(retrieveUser(result));
});

socket_member.on('receiveMembers', function(result) {
	store.dispatch(receiveMembers(result));
});

// ==================================================

socket_book.on('retrieveBook', function(result) {
	store.dispatch(receiveBook(result));
});

socket_book.on('receiveNotice', function(notice) {
	store.dispatch(receiveServerNotice(notice));
});

// ==================================================

socket_common.on('receiveCategory', function(result) {
	store.dispatch(receiveCategory(result));
});

socket_common.on('receiveNotice', function(notice) {
	store.dispatch(receiveServerNotice(notice));
});
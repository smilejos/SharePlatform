import { createRedux } from 'redux';
import store from '../store/store';
import io from 'socket.io-client';
import { receiveArticles, receiveArticle } from '../actions/ArticleActions';
import { receiveRealTimeMember, retrieveUser, receiveMembers } from '../actions/MemberActions';
import { receiveBook } from '../actions/BookActions';
import { receiveCategory, receiveServerNotice } from '../actions/CommonActions';

export const socket_article = io('/Article');
export const socket_member = io('/Member');
export const socket_book = io('/Book');
export const socket_common = io('/Common');

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

// ==================================================

socket_member.on('receiveRealTimeMember', function(result) {
	store.dispatch(receiveRealTimeMember(result));
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
import { createRedux } from 'redux';
import store from '../store/store';
import io from 'socket.io-client';
import { receiveArticles, receiveArticle } from '../actions/ArticleActions';
import { receiveRealTimeMember, retrieveUser } from '../actions/MemberActions';
import { receiveBook } from '../actions/BookActions';

export const socket_article = io('/Article');
export const socket_member = io('/Member');
export const socket_book = io('/Book');

// ==================================================

socket_article.on('retrieveArticle', function(article) {
	store.dispatch(receiveArticle(article));
});

socket_article.on('receiveList', function(articles) {
	store.dispatch(receiveArticles(articles));
});

socket_article.on('editArticle', function(article) {
	console.log('receive editArticle from Server', article);
	store.dispatch(receiveArticle(article));
});

// ==================================================

socket_member.on('receiveRealTimeMember', function(result) {
	store.dispatch(receiveRealTimeMember(result));
});

socket_member.on('retrieveUser', function(result) {
	store.dispatch(retrieveUser(result));
});

// ==================================================

socket_book.on('retrieveBook', function(result) {
	store.dispatch(receiveBook(result));
});
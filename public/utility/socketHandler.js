import { createRedux } from 'redux';
import store from '../store/index';
import io from 'socket.io-client';
import { receiveArticles, receiveArticle } from '../actions/ArticleActions';
import { receiveRealTimeMember, retrieveUser } from '../actions/MemberActions';

export const socket_article = io('/Article');
export const socket_member = io('/Member');

socket_article.on('retrieveArticle', function(article) {
	store.dispatch(receiveArticle(article));
});

socket_article.on('receiveList', function(articles) {
	store.dispatch(receiveArticles(articles));
});

socket_member.on('receiveRealTimeMember', function(result) {
	store.dispatch(receiveRealTimeMember(result));
});

socket_member.on('retrieveUser', function(result) {
	store.dispatch(retrieveUser(result));
});




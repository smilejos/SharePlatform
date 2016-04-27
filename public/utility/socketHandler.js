import { createRedux } from 'redux';
import store from '../store/index';
import io from 'socket.io-client';
import { receiveArticles, receiveArticle } from '../actions/ArticleActions';
import { receiveRealTimeMember } from '../actions/MemberActions';

export const socket_article = io('/Article');
export const socket_common = io('/Common');


socket_article.on('retrieveArticle', function(article) {
	store.dispatch(receiveArticle(article));
});

socket_article.on('receiveList', function(articles) {
	store.dispatch(receiveArticles(articles));
});

socket_common.on('receiveRealTimeMember', function(result) {
	store.dispatch(receiveRealTimeMember(result));
});


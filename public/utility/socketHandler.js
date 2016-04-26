import { createRedux } from 'redux';
import store from './store/index';
import io from 'socket.io-client';
import { receiveArticles, receiveArticle } from './actions/ArticleActions';
import { receiveRealTimeMember } from './actions/MemberActions';

const redux = createRedux({store});
export const socket_common = io('/Common');
export const socket_article = io('/Article ');

socket_article.on('retrieveArticle', function(article) {
	redux.dispatch(receiveArticle(article));
});

socket_article.on('receiveList', function(articles) {
	redux.dispatch(receiveArticles(articles));
});

socket_common.on('receiveRealTimeMember', function(result) {
	redux.dispatch(addHistory(result));
});


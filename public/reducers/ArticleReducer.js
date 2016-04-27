"use strict";
import { REQUEST_POST, REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POST, PUBLISH_POST, UPDATE_POST, COMPLETE_POST, LEAVE_POST } from '../constants/ArticleActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'

export default function articles(state = {
        isFetching: true,
        isUploading: false,
        isFilterByAuthor: false,
        articles: [],
        article: null
    }, action) {
	switch (action.type) {
    case REQUEST_POST:
    case REQUEST_POSTS:
		return merge({}, state, {
            isFetching: true,
            isUploading: false,
            articles: []
        });;
	case RECEIVE_POSTS:
		return merge({}, state, {
      		isFetching: false,
      		isUploading: false,
      		articles: action.articles
    	});
    case RECEIVE_POST:
        return merge({}, state, {
            isFetching: false,
            isUploading: false,
            article: action.article[0]
        });
	case PUBLISH_POST:
	case UPDATE_POST:
		return merge({}, state, {
			isFetching: false,
      		isUploading: true
    	});
	case COMPLETE_POST:
		return merge({}, state, {
			isFetching: false,
      		isUploading: false
		});
    case LEAVE_POST:
        return merge({}, state, {
            article: null,
        });
	default:
		return state;
	}
}
"use strict";
import { REQUEST_POST, REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POST, PUBLISH_POST, UPDATE_POST, 
    COMPLETE_POST, CLEAN_POST, CLEAN_EDITING_POST, LEAVE_POST, EDIT_POST } from '../constants/ArticleActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import assignIn from 'lodash/assignIn'


export default function articles(state = {
        isFetching: true,
        isUploading: false,
        isFilterByAuthor: false,
        articles: [],
        article: null,
        editingArticle: null
    }, action) {
	switch (action.type) {
    case REQUEST_POST:
    case REQUEST_POSTS:
		return assignIn({}, state, {
            isFetching: true,
            isUploading: false,
            articles: []
        });
	case RECEIVE_POSTS:
        return assignIn({}, state, {
            isFetching: false,
            isUploading: false,
            articles: action.articles
        });
    case RECEIVE_POST:
        return assignIn({}, state, {
            isFetching: false,
            isUploading: false,
            article: action.article,
            editingArticle: action.article
        });
	case PUBLISH_POST:
	case UPDATE_POST:
		return assignIn({}, state, {
			isFetching: false,
      		isUploading: true
    	});
	case COMPLETE_POST:
		return assignIn({}, state, {
			isFetching: false,
      		isUploading: false
		});
    case CLEAN_POST:
        return assignIn({}, state, {
            article: null,
        });
    case CLEAN_EDITING_POST:
        return assignIn({}, state, {
            editingArticle: null,
        });
    case EDIT_POST:
        return assignIn({}, state, {
            article: action.article,
            editingArticle: action.article
        });
    case LEAVE_POST:
	default:
		return state;
	}
}
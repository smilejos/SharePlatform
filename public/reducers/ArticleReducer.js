"use strict";
import { REQUEST_POST, REQUEST_POSTS, REQUEST_SUMMARY,
    RECEIVE_POSTS, RECEIVE_POST, PUBLISH_POST, UPDATE_POST, 
    RECEIVE_IMAGES, UPDATE_IMAGES, APPEND_IMAGE, DELETE_IMAGE,
    COMPLETE_POST, CLEAN_POST, CLEAN_POSTS, CLEAN_EDITING_POST, 
    LEAVE_POST, EDIT_POST, CHANGE_POST_TYPE,
    UPDATE_SLIDES, UPDATE_SLIDE_INDEX,
    UPLOAD_POST,
    FILTER_POST, CLEAR_FILTER_POST } from '../constants/ArticleActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import assignIn from 'lodash/assignIn'
import concat from 'lodash/concat'

export default function articles(state = {
        isFetching: true,
        isUploading: false,
        isFilter: false,
        articles: [],
        filter_articles: [],
        slides: [],
        slide_index: -1,
        images: [],
        article: {
            articleNo : null,
            title : '',
            author : '',
            content : '',
            tag : [],
            updateTime : null,
            publishTime : null,
            isBookArticle : false,
            isPrivate : false,
            isSlideshow: false
        },
        editingArticle: null
    }, action) {
	switch (action.type) {
    case REQUEST_POST:
    case REQUEST_POSTS:
    case REQUEST_SUMMARY:
    case CLEAN_POSTS:
		return assignIn({}, state, {
            isFetching: true,
            isUploading: false,
            isFilter: false,
            filter_articles: [],
            articles: [],
            slides: [],
            slide_index: -1
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
            editingArticle: action.article,
            slides: action.article.isSlideshow ? action.article.content.split("---") : [],
            slide_index: -1
        });
    case RECEIVE_IMAGES:
    case UPDATE_IMAGES:
        return assignIn({}, state, {
            isFetching: false,
            isUploading: false,
            images: action.list
        });
    case APPEND_IMAGE:
        return assignIn({}, state, {
            images: concat(state.images, action.item)
        });
    case DELETE_IMAGE:
	case PUBLISH_POST:
	case UPDATE_POST:
		return assignIn({}, state, {
			article: assignIn({}, state.article, action.article)
    	});
	case COMPLETE_POST:
		return assignIn({}, state, {
			isFetching: false,
      		isUploading: false
		});
    case CLEAN_POST:
        return assignIn({}, state, {
            images: [],
            article: assignIn({}, state.article, {
                articleNo: null,
                title: '',
                author: '',
                content: '',
                tag: [],
                updateTime: null,
                publishTime: null,
                isBookArticle: false,
                isPrivate: false,
                isSlideshow: false
            })
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
    case CHANGE_POST_TYPE:
        return assignIn({}, state, {
            article : assignIn({}, state.article, {
                isPrivate: action.isPrivate
            })
        });
    case FILTER_POST:
        return assignIn({}, state, {
            filter_articles: action.list,
            isFilter: true
        });
    case CLEAR_FILTER_POST:
        return assignIn({}, state, {
            filter_articles: [],
            isFilter: false
        });
    case UPDATE_SLIDES:
        return assignIn({}, state, {
            slides: action.slides
        });
    case UPDATE_SLIDE_INDEX:
        return assignIn({}, state, {
            slide_index: action.slide_index
        });
    case LEAVE_POST:
    case UPLOAD_POST:
	default:
		return state;
	}
}
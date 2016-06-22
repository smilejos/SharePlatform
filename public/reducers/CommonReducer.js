"use strict";
import { RETRIEVE_CATEGORY, SET_SEARCH_OPTIONS, SET_CATEGORY_COUNTS, SET_AUTHOR_COUNTS, 
    CLEAR_FILTER_OPTIONS, CLEAR_COUNTS, RECEIVE_SERVER_NOTICE, SENT_CLIENT_NOTICE } from '../constants/CommonActionTypes';
import assignIn from 'lodash/assignIn'

export default function common(state = {
        notice: {},
        category: [],
        category_counts: [],
        author_counts: [],
        search_options: {
        	isPrivate : false,
        	author: '',         // Auto fill in this info in server side
        	keyword: '',
        	tag: ''
        }
    }, action) {
	switch (action.type) {
        case SENT_CLIENT_NOTICE:
        case RECEIVE_SERVER_NOTICE:
            return assignIn({}, state, {
                notice: action.notice
            });
		case RETRIEVE_CATEGORY:
			return assignIn({}, state, {
                category: action.category
        	});
        case SET_SEARCH_OPTIONS: 
        	return assignIn({}, state, {
                search_options: assignIn({}, state.search_options, action.options)
        	});
        case SET_CATEGORY_COUNTS: 
            return assignIn({}, state, {
                category_counts: action.list
            });
        case SET_AUTHOR_COUNTS: 
            return assignIn({}, state, {
                author_counts: action.list
            });
        case CLEAR_FILTER_OPTIONS: 
            return assignIn({}, state, {
                search_options: assignIn({}, 
                    state.search_options, {tag: ''})
            });
        case CLEAR_COUNTS: 
            return assignIn({}, state, {
                category_counts: [],
                author_counts: [],
                search_options: assignIn({}, state.search_options, {tag: ''})
            });
		default:
			return state;
	}
}

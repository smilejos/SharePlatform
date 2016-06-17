"use strict";
import { RETRIEVE_CATEGORY, SET_SEARCH_OPTIONS } from '../constants/CommonActionTypes';
import assignIn from 'lodash/assignIn'

export default function common(state = {
        category: [],
        search_options: {
        	isPrivate : false,
        	author: '',         // Auto fill in this info in server side
        	keyword: '',
        	tag: ''
        }
    }, action) {
	switch (action.type) {
		case RETRIEVE_CATEGORY:
			return assignIn({}, state, {
                category: action.category
        	});
        case SET_SEARCH_OPTIONS: 
        	return assignIn({}, state, {
                search_options: assignIn({}, state.search_options, action.options)
        	});
		default:
			return state;
	}
}

"use strict";
import { QUERY_USER, RECEIVE_ONLINE_DATA, REQUEST_USER_DATA, RETRIEVE_USER_DATA } from '../constants/MemberActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'

export default function articles(state = {
        users: [],
        online_Users: [],
        self: {}
    }, action) {
	switch (action.type) {
        case QUERY_USER:
            return state;
		case RETRIEVE_USER_DATA:
			return merge({}, state, {
          		online_Users: action.online_Users,
          		self: action.self,
        	});
		case REQUEST_USER_DATA:
			return state;
		case RETRIEVE_USER_DATA:
			return state;
		default:
			return state;
	}
}
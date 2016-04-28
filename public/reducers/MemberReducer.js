"use strict";
import { QUERY_USER, RECEIVE_ONLINE_DATA, REQUEST_USER_DATA, RETRIEVE_USER_DATA } from '../constants/MemberActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import find from 'lodash/find'
import concat from 'lodash/concat'
import sortedUniq from 'lodash/sortedUniq'

export default function articles(state = {
        user: {},
        users: [],
        online_Users: [],
        self: {
        	Dept_No: '',
        	Dept_Name: '',
        	Dept_FullName: '',
        	Title_na: '',
        	Card_Na: '',
        	Tel_No: '',
        	Id_No: ''
        }
    }, action) {
	switch (action.type) {
        case QUERY_USER:
            return merge({}, state, {
                user: state.users.find({
                    Id_No: action.Id_No
                }),
            });
		case RECEIVE_ONLINE_DATA:
			return merge({}, state, {
                users: action.online_Users,
          		online_Users: action.online_Users,
          		self: action.self,
        	});
        case RETRIEVE_USER_DATA:
            return merge({}, state, {
                users: sortedUniq(concat(state.users, action.user)),
                user: action.user
            });
		case REQUEST_USER_DATA:
		default:
			return state;
	}
}
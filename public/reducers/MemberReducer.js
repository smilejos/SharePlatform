"use strict";
import { QUERY_USER, RECEIVE_ONLINE_DATA, REQUEST_USER_DATA, RETRIEVE_USER_DATA,
        REQUEST_MEMBER_DATA, RECEIVE_MEMBER_DATA
} from '../constants/MemberActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import find from 'lodash/find'
import assignIn from 'lodash/assignIn'
import concat from 'lodash/concat'
import sortedUniq from 'lodash/sortedUniq'

export default function members(state = {
        user: {},
        users: [],
        members: [],
        online_Users: [],
        self: {
        	dept_no: '',
        	dept_na: '',
        	dept_fullname: '',
        	title_na: '',
        	card_na: '',
        	tel_no: '',
        	Id_No: ''
        }
    }, action) {
	switch (action.type) {
        case QUERY_USER:
            return assignIn({}, state, {
                user: find(state.users, {
                    Id_No: action.Id_No
                })
            });
		case RECEIVE_ONLINE_DATA:
			return assignIn({}, state, {
                users: action.online_Users,
          		online_Users: action.online_Users,
          		self: action.self
        	});
        case RETRIEVE_USER_DATA:
            return assignIn({}, state, {
                users: sortedUniq(concat(state.users, action.user)),
                user: action.user
            });;
        case RECEIVE_MEMBER_DATA:
            return assignIn({}, state, {
                members: action.members
            });
		case REQUEST_USER_DATA:
        case REQUEST_MEMBER_DATA:
		default:
			return state;
	}
}
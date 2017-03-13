"use strict";
import { QUERY_USER, RECEIVE_LOGIN_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA,
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
        self: {
        	dept_no: '',
        	dept_na: '',
        	title_na: '',
        	card_na: '',
            tel_no: '',
            legacy_Id_No: '',
            user_name: '',
            worker_no: 0
        }
    }, action) {
	switch (action.type) {
        case QUERY_USER:
            return assignIn({}, state, {
                user: find(state.users, {
                    worker_no: action.worker_no
                })
            });
		case RECEIVE_LOGIN_USER:
			return assignIn({}, state, {
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
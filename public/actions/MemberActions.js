"use strict";
import { QUERY_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA, RECEIVE_LOGIN_USER,
		REQUEST_MEMBER_DATA, RECEIVE_MEMBER_DATA  } from '../constants/MemberActionTypes';
import { socket_member as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function getUser(worker_no) {
	return (dispatch, getState) => {
		let _user = find(getState().memberReducer.users, {
			worker_no: worker_no
        });
		if( _user ) {
			dispatch(changeUser(worker_no));
		} else {
			dispatch(requestUser(worker_no));
		}
	};
}

export function getMember() {
	return (dispatch, getState) => {
		if( getState().memberReducer.members.length == 0) {
			dispatch(requestMembers());
		}
	};
}

export function changeUser(worker_no) {
	return {
		type: QUERY_USER,
		worker_no
	};
}

export function requestUser(worker_no) {
	socket.emit('getEmployeeData', worker_no);
	return {
		type: REQUEST_USER_DATA
	};
}

export function requestMembers() {
	socket.emit('requestMembers');
	return {
		type: REQUEST_MEMBER_DATA
	};
}

export function receiveMembers(members) {
	return {
		type: RECEIVE_MEMBER_DATA,
		members
	};
}

export function retrieveUser(user) {
	return {
		type: RETRIEVE_USER_DATA,
		user: user
	};
}

export function receiveLoginUser(self) {
	return {
		type: RECEIVE_LOGIN_USER,
		self: self
	};
}

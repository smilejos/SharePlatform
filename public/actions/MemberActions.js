"use strict";
import { QUERY_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA, RECEIVE_ONLINE_DATA,
		REQUEST_MEMBER_DATA, RECEIVE_MEMBER_DATA  } from '../constants/MemberActionTypes';
import { socket_member as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function getUser(Id_No) {
	return (dispatch, getState) => {
		let _user = find(getState().memberReducer.users, {
			Id_No: Id_No
		});
		if( _user ) {
			dispatch(changeUser(Id_No));
		} else {
			dispatch(requestUser(Id_No));
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

export function changeUser(Id_No) {
	return {
		type: QUERY_USER,
		Id_No
	};
}

export function requestUser(Id_No) {
	socket.emit('getEmployeeData', Id_No);
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

export function receiveRealTimeMember(result) {
	return {
		type: RECEIVE_ONLINE_DATA,
		online_users: result.List,
		self: result.self
	};
}

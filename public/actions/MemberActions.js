"use strict";
import { QUERY_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA, RECEIVE_ONLINE_DATA  } from '../constants/MemberActionTypes';
import { socket_common as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function getUser(Id_No) {
	return (dispatch, getState) => {
		console.log('getUser', Id_No );
		let _user = find(getState().memberReducer.users, {
			Id_No: Id_No
		});
		console.log('getUser', _user );
		if( _user ) {
			dispatch(changeUser(Id_No));
		} else {
			console.log('dispatch');
			dispatch(requestUser(Id_No));
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


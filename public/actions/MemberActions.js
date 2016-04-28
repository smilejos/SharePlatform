"use strict";
import { QUERY_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA, RECEIVE_ONLINE_DATA  } from '../constants/MemberActionTypes';
import { socket_common as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function getUser(Id_No) {
	return (dispatch, getState) => {
		console.log( getState() );
		let _user = find(getState().memberReducer.users, {
			Id_No: Id_No
		});
		if( _user ) {
			return {
				type: QUERY_USER,
				IdNo
			};
		} else {
			dispatch(requestUser(Id_No));
		}
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


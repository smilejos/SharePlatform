"use strict";
import { QUERY_USER, REQUEST_USER_DATA, RETRIEVE_USER_DATA } from '../constants/ArticleActionTypes';
import { socket_common as socket } from '../utility/socketHandler.js';

export function getUser(IdNo) {
	return {
		type: QUERY_USER,
		IdNo
	};
}

export function requestUsers() {
	socket.emit('REQUEST_USER_DATA');
	return {
		type: REQUEST_USER_DATA
	};
}

export function retrieveUsers(users) {
	return {
		type: RETRIEVE_USER_DATA,
		users: users
	};
}

export function receiveRealTimeMember(result) {
	return {
		type: RECEIVE_ONLINE_DATA,
		online_users: result.List,
		self: result.self
	};
}


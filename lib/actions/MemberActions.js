"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUser = getUser;
exports.changeUser = changeUser;
exports.requestUser = requestUser;
exports.retrieveUser = retrieveUser;
exports.receiveRealTimeMember = receiveRealTimeMember;

var _MemberActionTypes = require('../constants/MemberActionTypes');

var _socketHandler = require('../utility/socketHandler.js');

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUser(Id_No) {
	return function (dispatch, getState) {
		console.log('getUser', Id_No);
		var _user = (0, _find2.default)(getState().memberReducer.users, {
			Id_No: Id_No
		});
		console.log('getUser', _user);
		if (_user) {
			dispatch(changeUser(Id_No));
		} else {
			console.log('dispatch');
			dispatch(requestUser(Id_No));
		}
	};
}

function changeUser(Id_No) {
	return {
		type: _MemberActionTypes.QUERY_USER,
		Id_No: Id_No
	};
}

function requestUser(Id_No) {
	_socketHandler.socket_member.emit('getEmployeeData', Id_No);
	return {
		type: _MemberActionTypes.REQUEST_USER_DATA
	};
}

function retrieveUser(user) {
	return {
		type: _MemberActionTypes.RETRIEVE_USER_DATA,
		user: user
	};
}

function receiveRealTimeMember(result) {
	return {
		type: _MemberActionTypes.RECEIVE_ONLINE_DATA,
		online_users: result.List,
		self: result.self
	};
}
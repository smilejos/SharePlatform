"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = articles;

var _MemberActionTypes = require('../constants/MemberActionTypes');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _union = require('lodash/union');

var _union2 = _interopRequireDefault(_union);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _assignIn = require('lodash/assignIn');

var _assignIn2 = _interopRequireDefault(_assignIn);

var _concat = require('lodash/concat');

var _concat2 = _interopRequireDefault(_concat);

var _sortedUniq = require('lodash/sortedUniq');

var _sortedUniq2 = _interopRequireDefault(_sortedUniq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function articles() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {
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
    } : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _MemberActionTypes.QUERY_USER:
            return (0, _assignIn2.default)({}, state, {
                user: (0, _find2.default)(state.users, {
                    Id_No: action.Id_No
                })
            });
        case _MemberActionTypes.RECEIVE_ONLINE_DATA:
            return (0, _assignIn2.default)({}, state, {
                users: action.online_Users,
                online_Users: action.online_Users,
                self: action.self
            });
        case _MemberActionTypes.RETRIEVE_USER_DATA:
            return (0, _assignIn2.default)({}, state, {
                users: (0, _sortedUniq2.default)((0, _concat2.default)(state.users, action.user)),
                user: action.user
            });;
        case _MemberActionTypes.REQUEST_USER_DATA:
        default:
            return state;
    }
}
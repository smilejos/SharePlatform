'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootReducer = undefined;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _ArticleReducer = require('../reducers/ArticleReducer');

var _ArticleReducer2 = _interopRequireDefault(_ArticleReducer);

var _MemberReducer = require('../reducers/MemberReducer');

var _MemberReducer2 = _interopRequireDefault(_MemberReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = exports.rootReducer = (0, _redux.combineReducers)({
  articleReducer: _ArticleReducer2.default,
  memberReducer: _MemberReducer2.default,
  routing: _reactRouterRedux.routerReducer
});
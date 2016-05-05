"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = articles;

var _ArticleActionTypes = require('../constants/ArticleActionTypes');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _union = require('lodash/union');

var _union2 = _interopRequireDefault(_union);

var _assignIn = require('lodash/assignIn');

var _assignIn2 = _interopRequireDefault(_assignIn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function articles() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {
        isFetching: true,
        isUploading: false,
        isFilterByAuthor: false,
        articles: [],
        article: null
    } : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _ArticleActionTypes.REQUEST_POST:
        case _ArticleActionTypes.REQUEST_POSTS:
            return (0, _assignIn2.default)({}, state, {
                isFetching: true,
                isUploading: false,
                articles: []
            });
        case _ArticleActionTypes.RECEIVE_POSTS:
            return (0, _assignIn2.default)({}, state, {
                isFetching: false,
                isUploading: false,
                articles: action.articles
            });
        case _ArticleActionTypes.RECEIVE_POST:
            return (0, _assignIn2.default)({}, state, {
                isFetching: false,
                isUploading: false,
                article: action.article[0]
            });
        case _ArticleActionTypes.PUBLISH_POST:
        case _ArticleActionTypes.UPDATE_POST:
            return (0, _assignIn2.default)({}, state, {
                isFetching: false,
                isUploading: true
            });
        case _ArticleActionTypes.COMPLETE_POST:
            return (0, _assignIn2.default)({}, state, {
                isFetching: false,
                isUploading: false
            });
        case _ArticleActionTypes.LEAVE_POST:
            return (0, _assignIn2.default)({}, state, {
                article: null
            });
        case _ArticleActionTypes.EDIT_POST:
            return (0, _assignIn2.default)({}, state, {
                article: action.article
            });
        default:
            return state;
    }
}
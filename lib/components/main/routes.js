'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _PersonalPage = require('../common/PersonalPage');

var _PersonalPage2 = _interopRequireDefault(_PersonalPage);

var _UserPage = require('../common/UserPage');

var _UserPage2 = _interopRequireDefault(_UserPage);

var _Article = require('../article/Article');

var _Article2 = _interopRequireDefault(_Article);

var _ArticleEditor = require('../article/ArticleEditor');

var _ArticleEditor2 = _interopRequireDefault(_ArticleEditor);

var _ArticlePreview = require('../article/ArticlePreview');

var _ArticlePreview2 = _interopRequireDefault(_ArticlePreview);

var _App = require('../common/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = _react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: _App2.default },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: _PersonalPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'user/:userID', component: _UserPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'article/:articleNo', component: _Article2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'articleEditor/:articleNo', component: _ArticleEditor2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'articleEditor', component: _ArticleEditor2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'articlePreview/:articleNo', component: _ArticlePreview2.default })
);

exports.default = routes;
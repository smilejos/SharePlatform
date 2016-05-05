"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _reactRouterRedux = require('react-router-redux');

var _reactRedux = require('react-redux');

var _socketHandler = require('../../utility/socketHandler');

var _store = require('../../store/store');

var _store2 = _interopRequireDefault(_store);

var _routes = require('../main/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, _store2.default);

(0, _reactDom.render)(_react2.default.createElement(
	_reactRedux.Provider,
	{ store: _store2.default },
	_react2.default.createElement(_reactRouter.Router, { history: history, routes: _routes2.default })
), document.getElementById('app'));

exports.default = _store2.default;
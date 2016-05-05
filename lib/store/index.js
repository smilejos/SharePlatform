"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require('../reducers/index');

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(history, initialState) {
	var store = (0, _redux.createStore)(_index.rootReducer, initialState, (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reactRouterRedux.routerMiddleware)(history)));

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', function () {
			var nextRootReducer = require('../reducers/index');
			store.replaceReducer(nextRootReducer);
		});
	}
	return store;
}

module.exports = configureStore;
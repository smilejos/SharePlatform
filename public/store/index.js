"use strict";
import { rootReducer } from '../reducers/index'
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk';

function configureStore(history, initialState) {
	const store = createStore(rootReducer, initialState, 
		applyMiddleware(thunkMiddleware, routerMiddleware(history)));

	if (module.hot) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('../reducers', () => {
	      const nextRootReducer = require('../reducers/index');
	      store.replaceReducer(nextRootReducer);
	    });
  	}
  	return store;
}


export default configureStore;
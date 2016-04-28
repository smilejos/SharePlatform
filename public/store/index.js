"use strict";
import { rootReducer } from '../reducers/index'
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

function configureStore() {
	const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
	if (module.hot) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('../reducers', () => {
	      const nextRootReducer = require('../reducers/index');
	      store.replaceReducer(nextRootReducer);
	    });
  	}
  	return store;
}

const _configureStore = configureStore();
export default _configureStore;
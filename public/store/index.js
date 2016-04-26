"use strict";
import { rootReducer } from '../reducers/index'
import { createStore } from 'redux'

export default function configureStore(initialState) {
	const store = createStore(rootReducer, initialState);
	if (module.hot) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('../reducers', () => {
	      const nextRootReducer = require('../reducers/index');
	      store.replaceReducer(nextRootReducer);
	    });
  	}

	console.log(store);
  	return store;
}

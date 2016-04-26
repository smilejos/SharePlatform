"use strict";
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from '../../store/index'

import User from '../common/User.jsx'
import App from '../common/App.jsx'
import Task from '../common/Task.jsx'
import Personal from '../common/Personal.jsx'

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render((
	<Provider store={store}>
		<Router history={browserHistory}>
		    <Route path="/" component={ Personal }>
		      	<Route path="user/:userID" component={Personal}></Route>
		    </Route>
	  	</Router>
  	</Provider>
), document.getElementById('app'))



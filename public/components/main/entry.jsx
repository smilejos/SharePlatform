"use strict";
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { socket_common, socket_article } from '../../utility/socketHandler'
import store from '../../store/index'

import PersonalPage from '../common/PersonalPage.jsx'
import UserPage from '../common/UserPage.jsx'
import Article from '../article/Article.jsx'
import App from '../common/App.jsx'

const history = syncHistoryWithStore(browserHistory, store);

render((
	<Provider store={store}>
		<Router history={history}>
		    <Route path="/" component={App}>
		    	<IndexRoute component={PersonalPage} />
		      	<Route path="user/:userID" component={UserPage} />
		      	<Route path="article/:articleNo" component={Article} />
		    </Route>
	  	</Router>
  	</Provider>
), document.getElementById('app'))



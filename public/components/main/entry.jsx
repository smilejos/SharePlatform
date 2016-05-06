"use strict";
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import store from '../../store/store'
import routes from '../main/routes'

const history = syncHistoryWithStore(browserHistory, store);

render((
	<Provider store={store}>
		<Router history={history}  routes={routes} />
  	</Provider>
), document.getElementById('app'))

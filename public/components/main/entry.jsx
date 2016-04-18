"use strict";
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, Redirect } from 'react-router'

import User from '../common/User.jsx'
import App from '../common/App.jsx'
import Task from '../common/Task.jsx'
import Personal from '../common/Personal.jsx'

render((
  <Router history={browserHistory}>
    <Route path="/" component={ Personal }>
      <Route path="user/:userID" component={Personal}></Route>
    </Route>
  </Router>
), document.getElementById('app'))
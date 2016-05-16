import React from 'react'
import { render } from 'react-dom'
import { Route, IndexRoute } from 'react-router'

import PersonalPage from '../common/PersonalPage'
import UserPage from '../common/UserPage'
import Article from '../article/Article'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'
import App from '../common/App'

const routes = (
  	<Route path="/" component={App}>
		<IndexRoute component={PersonalPage} />
	  	<Route path="user/:userID" component={UserPage} />
	  	<Route path="article/:articleNo" component={Article} />
	  	<Route path="articleEditor/:articleNo" component={ArticleEditor} />
	  	<Route path="articlePreview/:articleNo" component={ArticlePreview} />
	</Route>
)

export default routes

import React from 'react'
import { render } from 'react-dom'
import { Route, IndexRoute } from 'react-router'

import PersonalPage from '../common/PersonalPage'
import UserPage from '../common/UserPage'
import Article from '../article/Article'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'
import BookCreator from '../book/BookCreator'
import App from '../common/App'

const routes = (
  	<Route path="/" component={App}>
		<IndexRoute component={PersonalPage} />
	  	<Route path="user/:userID" component={UserPage} />
	  	<Route path="article/:articleNo" component={Article} />
	  	<Route path="articleEditor/:articleNo" component={ArticleEditor} />
	  	<Route path="articlePreview/:articleNo" component={ArticlePreview} />
	  	<Route path="createBook" component={BookCreator} />
	  	<Route path="book/:bookNo" component={ArticlePreview}>
	  		<Route path="book/:bookNo/:articleNo" component={Article}></Route>
	  	</Route>
	</Route>
)

export default routes

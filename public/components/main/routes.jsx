import React from 'react'
import { render } from 'react-dom'
import { Route, IndexRoute } from 'react-router'

import PersonalPage from '../common/PersonalPage'
import UserPage from '../common/UserPage'
import Article from '../article/Article'
import ArticleSetting from '../article/ArticleSetting'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'
import BookSetting from '../book/BookSetting'
import BookManager from '../book/BookManager'
import App from '../common/App'

const routes = (
  	<Route path="/" component={App}>
		<IndexRoute component={PersonalPage} />
	  	<Route path="User/:userID" component={UserPage} />
	  	<Route path="Article/:articleNo" component={Article} />
	  	<Route path="ArticleCreator" component={ArticleSetting} />
	  	<Route path="ArticleSetting/:articleNo" component={ArticleSetting} />
	  	<Route path="ArticleEditor/:articleNo" component={ArticleEditor} />
	  	<Route path="ArticlePreview/:articleNo" component={ArticlePreview} />
	  	<Route path="BookCreator" component={BookSetting} />
	  	<Route path="BookSetting/:bookNo" component={BookSetting} />
	  	<Route path="Book/:bookNo" component={BookManager}>
	  		<Route path="Book/:bookNo/:articleNo" component={BookManager}></Route>
	  	</Route>
	</Route>
)

export default routes

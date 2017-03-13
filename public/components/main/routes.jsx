import React from 'react'
import { render } from 'react-dom'
import { Route, IndexRoute } from 'react-router'

import PersonalPage from '../common/PersonalPage'
import UserPage from '../common/UserPage'
import LoginPage from '../common/Login'
import Article from '../article/Article'
import ArticleSetting from '../article/ArticleSetting'
import ArticleEditor from '../article/ArticleEditor'
import ArticleSource from '../article/ArticleSource'
import ArticleSlideShow from '../article/ArticleSlideShow'
import BookSetting from '../book/BookSetting'
import BookView from '../book/BookView'
import Search from '../search/Search'
import SearchResult from '../search/SearchResult'
import CategoryMap from '../search/CategoryMap'
import GroupMap from '../search/GroupMap'
import App from '../common/App'

const routes = (
  	<Route path="/" component={App}>
        <IndexRoute component={PersonalPage} />
        <Route path="Page/Login" component={LoginPage} />	  
	  	<Route path="Page/User/:worker_no" component={UserPage} />
	  	<Route path="Page/Article/View/:articleNo" component={Article} />
	  	<Route path="Page/Article/Creator" component={ArticleSetting} />
	  	<Route path="Page/Article/Setting/:articleNo" component={ArticleSetting} />
	  	<Route path="Page/Article/Editor/:articleNo" component={ArticleEditor} />
	  	<Route path="Page/Article/SlideShow/:articleNo" component={ArticleSlideShow} />
	  	<Route path="Page/Article/Source/:articleNo" component={ArticleSource} />
	  	<Route path="Page/Search" component={Search} />
	  	<Route path="Page/Search/Result/:type/:keyword" component={SearchResult} />
		<Route path="Page/Tag" component={CategoryMap} />
		<Route path="Page/Group" component={GroupMap} />	  	
	  	<Route path="Page/Book/Creator" component={BookSetting} />
	  	<Route path="Page/Book/Setting/:bookNo" component={BookSetting} />
	  	<Route path="Page/Book/:bookNo" component={BookView}>
	  		<Route path=":articleNo" component={Article}></Route>
	  	</Route>
	</Route>
)

export default routes

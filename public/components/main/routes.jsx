import React from 'react'
import { render } from 'react-dom'
import { Route, IndexRoute } from 'react-router'

import PersonalPage from '../common/PersonalPage'
import UserPage from '../common/UserPage'
import Article from '../article/Article'
import ArticleSetting from '../article/ArticleSetting'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'
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
	  	<Route path="User/:userID" component={UserPage} />
	  	<Route path="Article/:articleNo" component={Article} />
	  	<Route path="ArticleCreator" component={ArticleSetting} />
	  	<Route path="ArticleSetting/:articleNo" component={ArticleSetting} />
	  	<Route path="ArticleEditor/:articleNo" component={ArticleEditor} />
	  	<Route path="ArticlePreview/:articleNo" component={ArticlePreview} />
	  	<Route path="ArticleSlideShow/:articleNo" component={ArticleSlideShow} />
	  	<Route path="ArticleSource/:articleNo" component={ArticleSource} />
	  	<Route path="Search" component={Search} />
	  	<Route path="SearchResult/:type/:keyword" component={SearchResult} />
		<Route path="Tag" component={CategoryMap} />
		<Route path="Group" component={GroupMap} />	  	
	  	<Route path="BookCreator" component={BookSetting} />
	  	<Route path="BookSetting/:bookNo" component={BookSetting} />
	  	<Route path="Book/:bookNo" component={BookView}>
	  		<Route path=":articleNo" component={Article}></Route>
	  	</Route>
	</Route>
)

export default routes

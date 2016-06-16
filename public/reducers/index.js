import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import articleReducer from '../reducers/ArticleReducer'
import memberReducer from '../reducers/MemberReducer'
import bookReducer from '../reducers/BookReducer'
import commonReducer from '../reducers/CommonReducer'

export const rootReducer = combineReducers({
	articleReducer,
  	memberReducer,
  	bookReducer,
  	commonReducer,
  	routing: routerReducer
})
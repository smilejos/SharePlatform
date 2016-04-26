import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import articleReducer from '../reducers/ArticleReducer'
import memberReducer from '../reducers/MemberReducer'

export const rootReducer = combineReducers({
	articleReducer,
  	memberReducer,
  	routing: routerReducer
})
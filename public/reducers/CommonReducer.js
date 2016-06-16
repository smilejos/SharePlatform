"use strict";
import { RETRIEVE_CATEGORY } from '../constants/CommonActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import find from 'lodash/find'
import assignIn from 'lodash/assignIn'
import concat from 'lodash/concat'
import sortedUniq from 'lodash/sortedUniq'

export default function common(state = {
        category: []
    }, action) {
	switch (action.type) {
		case RETRIEVE_CATEGORY:
			return assignIn({}, state, {
                category: action.category
        	});
		default:
			return state;
	}
}
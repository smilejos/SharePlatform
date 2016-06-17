"use strict";
import { RETRIEVE_CATEGORY, SET_SEARCH_OPTIONS  } from '../constants/CommonActionTypes';
import { socket_article as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function receiveCategory(category) {
	return {
		type: RETRIEVE_CATEGORY,
		category
	};
}

export function setSearchOptions(options) {
	return {
		type: SET_SEARCH_OPTIONS,
		options
	};
}

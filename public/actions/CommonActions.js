"use strict";
import { RETRIEVE_CATEGORY, SET_SEARCH_OPTIONS, SET_CATEGORY_COUNTS, SET_AUTHOR_COUNTS, CLEAR_FILTER_OPTIONS } from '../constants/CommonActionTypes';
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

export function setCategoryCounts(list) {
	return {
		type: SET_CATEGORY_COUNTS,
		list
	};
}

export function setAuthorsCounts(list) {
	return {
		type: SET_AUTHOR_COUNTS,
		list
	};
}

export function clearFilterOptions() {
	return {
		type: CLEAR_FILTER_OPTIONS,
	};
}



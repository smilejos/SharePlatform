"use strict";
import { RETRIEVE_CATEGORY  } from '../constants/CommonActionTypes';
import { socket_common as socket } from '../utility/socketHandler.js';
import find from 'lodash/find'

export function receiveCategory(category) {
	
	return {
		type: RETRIEVE_CATEGORY,
		category
	};
}

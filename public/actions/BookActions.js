"use strict";
import { CREATE_BOOK, DELETE_BOOK, REQUEST_BOOK, RECEIVE_BOOK, CHANGE_BOOK_TYPE, SAVE_BOOK, SAVE_POST,
		CREATE_CHAPTER, DELETE_CHAPTER, 
		MOVE_POST, REMOVE_POST, CREATE_POST, 
        CHANGE_POST_ORDER, CHANGE_CHAPTER_ORDER, SHOW_MENU, HIDE_MENU } from '../constants/BookActionTypes';
import { socket_book as socket } from '../utility/socketHandler';

export function createBook(book) {
	socket.emit('createBook', book);
	return {
		type: CREATE_BOOK,
		book
	};
}

export function changeBookType (isPrivate) {
	return {
		type: CHANGE_BOOK_TYPE,
		isPrivate
	};
}

export function requestBook (bookNo) {
	socket.emit('requestBook', bookNo);
	return {
		type: REQUEST_BOOK
	};
}

export function receiveBook (book) {
	return {
		type: RECEIVE_BOOK,
		book
	};
}

export function showMenu (X, Y) {
	return {
		type: SHOW_MENU,
		X,
		Y
	};
}

export function hideMenu () {
	return {
		type: HIDE_MENU
	};
}

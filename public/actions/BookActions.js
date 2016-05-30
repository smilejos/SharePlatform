"use strict";
import { CREATE_BOOK, DELETE_BOOK, CHANGE_BOOK_TYPE, CREATE_CHAPTER, DELETE_CHAPTER, MOVE_POST, REMOVE_POST, CREATE_POST, 
        CHANGE_POST_ORDER, CHANGE_CHAPTER_ORDER, SAVE_BOOK, SAVE_POST, SHOW_MENU, HIDE_MENU } from '../constants/BookActionTypes';
import { socket_book as socket } from '../utility/socketHandler';

export function createBook(book) {
	socket.emit('createBook', book);
	return {
		type: CREATE_BOOK,
		book
	}
}

export function changeBookType (isPrivate) {
	return {
		type: CHANGE_BOOK_TYPE,
		isPrivate
	}
}

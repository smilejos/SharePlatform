"use strict";
import { CREATE_BOOK, DELETE_BOOK, REQUEST_BOOK, RECEIVE_BOOK, CHANGE_BOOK_TYPE, SAVE_BOOK, SAVE_POST,
        CREATE_CHAPTER, DELETE_CHAPTER, 
        MOVE_POST, REMOVE_POST, CREATE_POST, 
        CHANGE_POST_ORDER, CHANGE_CHAPTER_ORDER, SHOW_MENU, HIDE_MENU } from '../constants/BookActionTypes';
import merge from 'lodash/merge'
import union from 'lodash/union'
import concat from 'lodash/concat'
import assignIn from 'lodash/assignIn'

export default function book(state = {
        book: {
            bookNo: null,
            title: null,
            isPrivate: false,
            tag: []
        },
        chapters: [],
        isMenuShow: false,
        MenuPosition: {
            X: 0,
            Y: 0
        },
        articles: [],
        article: null
    }, action) {
	switch (action.type) {
    case REQUEST_BOOK:
        return state;
    case RECEIVE_BOOK:
        return assignIn({}, state, {
            book: action.book
        });
    case CREATE_BOOK:
        return assignIn({}, state, {
            book: {
                title: action.book.title,
                tag: action.book.tag,
                isPrivate: action.book.isPrivate
            }
        });
    case CHANGE_BOOK_TYPE:
        return assignIn({}, state, {
            book: {
                isPrivate: action.isPrivate
            }
        });
    case CREATE_CHAPTER:
		return assignIn({}, state, {
            chapters: concat(chapters, {
                chapterNo: null,
                bookNo: action.bookNo,
                title: ''
            })
        });
    case SHOW_MENU:
        return assignIn({}, state, {
            isMenuShow: true,
            MenuPosition: {
                X: action.X,
                Y: action.Y
            }
        });
    case HIDE_MENU:
        return assignIn({}, state, {
            isMenuShow: false
        });
	default:
		return state;
	}
}

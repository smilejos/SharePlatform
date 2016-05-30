"use strict";
import { CREATE_BOOK, DELETE_BOOK, CHANGE_BOOK_TYPE, CREATE_CHAPTER, DELETE_CHAPTER, MOVE_POST, REMOVE_POST, CREATE_POST, 
        CHANGE_POST_ORDER, CHANGE_CHAPTER_ORDER, SAVE_BOOK, SAVE_POST, SHOW_MENU, HIDE_MENU } from '../constants/BookActionTypes';
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
        articles: [],
        article: null
    }, action) {
	switch (action.type) {
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
	default:
		return state;
	}
}
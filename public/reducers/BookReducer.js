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
        chapters: [
            {
                chapterNo: 0,
                chapterOrder: 0,
                chapterTitle: 'Basic',
                parts: [
                    { articleNo: 36, articleOrder: 0, partTitle: '變數'} ,
                    { articleNo: 37, articleOrder: 1, partTitle: '解構賦值'} ,
                    { articleNo: 38, articleOrder: 2, partTitle: '物件'} ,
                    { articleNo: 48, articleOrder: 3, partTitle: '陣列'} ,
                    { articleNo: 49, articleOrder: 4, partTitle: '字串'} ,
                    { articleNo: 55, articleOrder: 5, partTitle: '函式'} ,
                    { articleNo: 56, articleOrder: 6, partTitle: '正則'} 
                ]
            } , {
                chapterNo: 1,
                chapterOrder: 1,
                chapterTitle: 'Advanced',
                parts: [
                    { articleNo: 52, articleOrder: 0, partTitle: '類別'} ,
                    { articleNo: 50, articleOrder: 1, partTitle: '修飾'} ,
                    { articleNo: 51, articleOrder: 2, partTitle: '模組'} 
                ]
            }
        ],
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

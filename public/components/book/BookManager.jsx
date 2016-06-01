"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import * as BookActions from '../../actions/BookActions'

import ArticleContent from '../article/ArticleContent'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestBook } = this.props.actions;
        requestBook(this.props.params.bookNo);
    }

    _handleRightClick(e) {
        console.log(this.props.actions);
        let { showMenu } = this.props.actions;
        showMenu(e.pageX, e.pageY);
        e.preventDefault();
    }

    render() {
        let book = this.props.state.book;
        return (
            <div onContextMenu={this._handleRightClick.bind(this)}>
                <div>{ book != null ? book.bookNo : "" }</div>
                <div>{ book != null ? book.title : "" }</div>
                <BookMenu position={this.props.state.MenuPosition} isMenuShow ={this.props.state.isMenuShow} />
            </div>
        )
    }
}

class BookMenu extends React.Component {
    render() {
        const layout = {
            position: 'fixed',
            top: this.props.position.Y,
            left: this.props.position.X,
            visibility: this.props.isMenuShow ? 'visible' : 'hidden'
        };

        return (
            <div style={layout}>
                <ul className="BookMenu">
                    <li><i className="fa fa-plus" /><span>New Article</span></li>
                    <li><i className="fa fa-edit" /><span>Rename</span></li>
                    <li><i className="fa fa-trash" /><span>Delete</span></li>
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        state: state.bookReducer
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(BookActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)

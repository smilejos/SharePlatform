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

class BookManager extends React.Component {
    constructor(props){
        super(props);
        let { requestBook } = this.props.actions;
        requestBook(this.props.params.bookNo);
    }

    _handleRightClick(e) {
        //console.log(this.props.actions);
        let { showMenu } = this.props.actions;
        showMenu(e.pageX, e.pageY);
        e.preventDefault();
    }

    render() {
        let chapters = this.props.state.chapters;
        let list;
        if( chapters && chapters.length > 0 ) {
            list = chapters.map(function(item, index){
                return <Chapter key={index} chapter={item}  />
            });
        }
        return (
            <div className="BookStructure" onContextMenu={this._handleRightClick.bind(this)}>
                {list}
                <BookMenu 
                    position={this.props.state.MenuPosition} 
                    isMenuShow ={this.props.state.isMenuShow}
                />
            </div>
        )
    }
}

class BookMenu extends React.Component {

    _handleClick(e, type) {
        console.log(e, type);
    }

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
                    <li><i className="fa fa-plus" /><span onClick={this._handleClick.bind(this, 'Add')}>New Article</span></li>
                    <li><i className="fa fa-share-alt" /><span onClick={this._handleClick.bind(this, 'Connect')}>Conncet</span></li>
                    <li><i className="fa fa-edit" /><span onClick={this._handleClick.bind(this, 'Rename')}>Rename</span></li>
                    <li><i className="fa fa-trash" /><span onClick={this._handleClick.bind(this, 'Delete')}>Delete</span></li>
                </ul>
            </div>
        );
    }
}

class Chapter extends React.Component {

    render(){
        let parts = this.props.chapter.parts;
        let list;
        if( parts && parts.length > 0 ) {
            list = parts.map(function(item, index){
                return <Part key={index} part={item}  />
            });
        }
        return (
            <div className="ChapterSection">
                <div className="Chapter">
                    <i className="fa fa-paragraph" />
                    {this.props.chapter.chapterTitle}
                </div>
                {list}
            </div>
        )    
    }
}

class Part extends React.Component {
    render(){
        return (
            <div className="Part">
                <i className="fa fa-file-text-o" />
                {this.props.part.partTitle}
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
)(BookManager)

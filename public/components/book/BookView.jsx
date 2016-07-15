"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as BookActions from '../../actions/BookActions'

import ArticleContent from '../article/ArticleContent'
import ArticleEditor from '../article/ArticleEditor'
import ArticlePreview from '../article/ArticlePreview'

class BookView extends React.Component {
    constructor(props){
        super(props);
        let { requestBook } = this.props.actions;
        requestBook(this.props.params.bookNo);
    }

    render() {
        let chapters = this.props.state.chapters;
        let bookNo = this.props.params.bookNo;
        let list;
        console.log(chapters);
        if( chapters && chapters.length > 0 ) {
            list = chapters.map(function(item, index){
                return <Chapter key={index} chapter={item} bookNo={bookNo}  />
            });
        }
        return (
            <div className="BookView">
                <div className="BookStructure">
                    {list}
                </div>
                <div className="BookContent">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class Chapter extends React.Component {
    render(){
        let parts = this.props.chapter.parts;
        let bookNo = this.props.bookNo;
        let list;
        if( parts && parts.length > 0 ) {
            list = parts.map(function(item, index){
                return <Part key={index} part={item} bookNo={bookNo} />
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
        let path = this.props.bookNo + "/" + this.props.part.articleNo;
        return (
            <div className="Part">
                <i className="fa fa-file-text-o" />
                <Link className="ArticleEdit" to={ "/Book/" + path}>{this.props.part.partTitle}</Link>
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
)(BookView)

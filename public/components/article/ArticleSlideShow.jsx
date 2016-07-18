"use strict";
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import screenfull from 'screenfull';
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleContent from '../article/ArticleContent'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        requestArticle(this.props.params.articleNo);
    }

    componentWillReceiveProps(nextProps) {
        let { updateSlides, updateSlideIndex } = this.props.actions;
        if( this.props.article.articleNo != nextProps.article.articleNo ) {
            let _slides = nextProps.article.content.split("---");
            updateSlides(_slides);
            updateSlideIndex(0);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        if( nextProps.slides.length > 0 && this.props.index != nextProps.index) {
            return true;
        } else {
            return false;
        }
    } 

    componentDidMount() {
        let { syncArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        leaveArticle(this.props.params.articleNo);
        cleanArticle();
    }

    _toggleFullScreen() {
        let enabled = screenfull.enabled;
        if( enabled ) {
            let dom = findDOMNode(this.refs.content);
            screenfull.request(dom);
        }
    }

    _nextSlide() {
        console.log('click');
        let { updateSlideIndex } = this.props.actions;
        let index = this.props.index + 1;
        updateSlideIndex(index);
    }

    render() {
        let content = this.props.index > -1 ? this.props.slides[this.props.index] : "";
        return (
            <div className= { this.props.index > -1 ? "ArticleSlideShow" : "ArticleContent"} ref="content">
                <ArticleButton toggleFullScreen={this._toggleFullScreen.bind(this)} />
                <div className="ArticlePage"  onClick={ this._nextSlide.bind(this) } >
                    <ArticleContent content={ content }  />
                </div>
            </div>
        );
    }
}

class ArticleButton extends React.Component {
    _onClick() {
        this.props.toggleFullScreen();
    }

    render() {
        return (
            <div className="ArticleControl">
                <i className="fa fa-laptop fa-lg" />
                <span className="ArticleEdit" onClick={this._onClick.bind(this)}>Play</span>
            </div>
        )
    }
}


class Preview extends React.Component {

}

function mapStateToProps(state) {
    return { 
        article: state.articleReducer.article,
        slides: state.articleReducer.slides,
        index: state.articleReducer.slide_index,
        self: state.memberReducer.self
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)


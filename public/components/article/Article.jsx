"use strict";
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import screenfull from 'screenfull';
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleContent from '../article/ArticleContent'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        console.log(this.props.params.articleNo);
        requestArticle(this.props.params.articleNo);
    }

    componentWillReceiveProps(nextProps) {
        let { requestArticle, leaveArticle, cleanArticle } = this.props.actions;
        if( this.props.params.articleNo != nextProps.params.articleNo) {
            cleanArticle();
            leaveArticle(this.props.params.articleNo);

            if ( this.props.params.articleNo != '') {
                requestArticle(nextProps.params.articleNo);
            }
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        // Make sure content already download from server
        if( nextProps.state.article.articleNo != null) {
            return true;
        } else {
            return false;
        }

        return true;
    }

    componentDidMount() {
        let { syncArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        cleanArticle();
        leaveArticle(this.props.params.articleNo);
    }

    _renderContent() {
        return (
            <div>
                <ArticleButton article={this.props.state.article} Id_No={this.props.self.Id_No } />
                <div className="ArticlePage">
                    <ArticleTitle title={this.props.state.article.title} />
                    <ArticleContent ref="content" content={this.props.state.article.content } />
                </div>
            </div>
        );
    }

    _renderLoading() {
        return (
            <div className="ArticleLoading">
                <i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    render() {
        let content;
        if ( this.props.state.article.articleNo != null ) {
            console.log('render content');
            content = this._renderContent.bind(this)();
        } else {
            console.log('render div');
            content = this._renderLoading();
        }
        
        return (
            <div className="ArticleContent">
                {content}
            </div>
        );
    }
}

class ArticleTitle extends React.Component {
    render() {
        return (
            <div className="ArticleTitle">
                <span>{this.props.title}</span>
            </div>
        )
    }
}

class ArticleButton extends React.Component {
    _renderAuthorAction() {
        return (
            <span>
                <i className="fa fa-cog fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSetting/" + this.props.article.articleNo }>Setting</Link>
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleEditor/" + this.props.article.articleNo }>Edit</Link>
            </span>
        );
    }

    _renderDefaultButton() {
        return (
            <span>
                <i className="fa fa-eye fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSource/" + this.props.article.articleNo }>Source</Link>
            </span>
        );
    }

    _renderSlideshowButton() {
        return (
            <span>
                <i className="fa fa-laptop fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSlideShow/" + this.props.article.articleNo }>SlideShow</Link>
            </span>
        );
    }

    render() {
        let defaultButton, authorButton, slideshowButton;
        if( this.props.article != null ) {
            defaultButton = this._renderDefaultButton.bind(this)();
            authorButton = this.props.article.author == this.props.Id_No ? this._renderAuthorAction.bind(this)() : null;
            slideshowButton = this.props.article.isSlideshow ? this._renderSlideshowButton.bind(this)() : null;
        } else {
            defaultButton = null;
            authorButton = null;
            slideshowButton = null;
        }
        
        return (
            <div className="ArticleControl">
                { slideshowButton }
                { defaultButton }
                { authorButton }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        state: state.articleReducer,
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


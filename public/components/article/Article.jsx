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
        let { requestArticle } = this.props.actions;
        if( this.props.params.articleNo != nextProps.params.articleNo) {
            requestArticle(nextProps.params.articleNo);
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

    render() {
        let content, title, control ;
        if( this.props.state.article != null ) {
            content = <ArticleContent ref="content" content={ this.props.state.article.content } />;
            title = <ArticleTitle title = { this.props.state.article.title } />;
        } else {
            content = <div />;
            title = <div />;
        }

        if (this.props.state.article != null && this.props.state.article.author == this.props.self.Id_No ) {
            control = <ArticleEditButton articleNo = { this.props.params.articleNo } />;
        } else {
            control = <ArticleButton articleNo = { this.props.params.articleNo } />;
        }

        return (
            <div className="ArticleContent">
                { control }
                <div className="ArticlePage">
                    {title}
                    {content}
                </div>
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
    render() {
        return (
            <div className="ArticleControl">
                <i className="fa fa-eye fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSource/" + this.props.articleNo }>Source</Link>
                <i className="fa fa-laptop fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSlideShow/" + this.props.articleNo }>SlideShow</Link>
            </div>
        )
    }
}

class ArticleEditButton extends React.Component {
    render() {
        return (
            <div className="ArticleControl">
                <i className="fa fa-laptop fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSlideShow/" + this.props.articleNo }>SlideShow</Link>
                <i className="fa fa-eye fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSource/" + this.props.articleNo }>Source</Link>
                <i className="fa fa-cog fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSetting/" + this.props.articleNo }>Setting</Link>
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleEditor/" + this.props.articleNo }>Edit</Link>
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


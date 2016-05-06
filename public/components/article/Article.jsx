"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleContent from '../article/ArticleContent'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        requestArticle(this.props.params.articleNo);
    }

    componentWillUnmount() {
        let { leaveArticle } = this.props.actions;
        leaveArticle();
    }

    render() {
        let content, control ;
        if( this.props.state.article != null ) {
            content = <ArticleContent article = { this.props.state.article } />;
        } else {
            content = <div />;
        }

        if (this.props.state.article != null && this.props.state.article.Author == this.props.self.Id_No ) {
            control = <ArticleEditButton articleNo = { this.props.params.articleNo } />;
        } else {
            control = <div />;
        }

        return (
            <div className="ArticleContent">
                { control }
                { content }
            </div>
        );
    }
}

class ArticleEditButton extends React.Component {
    render() {
        return (
            <div className="ArticleControl">
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/articleEditor/" + this.props.articleNo }>Edit</Link>
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


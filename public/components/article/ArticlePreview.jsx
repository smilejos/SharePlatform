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
    }

    componentWillUnmount() {
        let { cleanEditingArticle } = this.props.actions;
        cleanEditingArticle();
    }

    _transferToPreview(){
        let { editArticle } = this.props.actions;
        editArticle(this.props.state.editingArticle, false);
    }
    
    render() {
        let content, title;
        let articleNo = this.props.params.articleNo;
        if( this.props.state.editingArticle != null ) {
            content = <ArticleContent content = { this.props.state.editingArticle.content } />;
            title = <ArticleTitle title = { this.props.state.article.title } />;
        } else {
            content = <div />;
            title = <div />;
        }  
        return (
            <div className="ArticleContent">
                <div className="ArticleControl">
                    <i className="fa fa-edit fa-lg" />
                    <Link className="ArticleEdit"  onClick={this._transferToPreview.bind(this)} to={"/ArticleEditor/" + articleNo}>Return to Edit</Link>
                </div>
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

function mapStateToProps(state) {
    return { state: state.articleReducer }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)


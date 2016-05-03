"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import highlight from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'


class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        requestArticle(this.props.params.articleNo);
    }

    render() {
        let content;
        if( this.props.state.article != null ) {
            content = <ArticleContent article = { this.props.state.article } />;
        } else {
            content = <div />;
        }  
        return (
            <div className="ArticleContent">
                <div className="ArticleControl">
                    <i className="fa fa-edit fa-lg" />
                    <Link className="ArticleEdit" to={ "/creation/" + this.props.params.articleNo }>Edit</Link>
                </div>
                { content }
            </div>
        );
    }
}

class ArticleContent extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        let articleNo = this.props.article.articleNo;
    }

    _renderMarkup(content) {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            highlight: function (code, lang) {
                if(lang) {
                    return require('highlight.js').highlight(lang, code).value;    
                } else {
                    return require('highlight.js').highlightAuto(code).value;    
                }
                
            }
        });
        return { __html: marked(content)};
    }

    _renderTitle(title){
        return (
            <span>{title}</span>
        )
    }

    render() {
        return (
            <div className="ArticlePage">
                <div className="ArticleTitle">
                    { this._renderTitle(this.props.article.Title)}
                </div>
                <div className="markdown-body" dangerouslySetInnerHTML={ this._renderMarkup(this.props.article.Content) } /> 
            </div>
        );
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


"use strict";
import React from 'react'
import { render } from 'react-dom'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'

export default class ArticleContent extends React.Component {
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
            breaks: true,
            pedantic: true,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            highlight: function (code, lang) {
                if(lang) {
                    return highlight(lang, code).value;    
                } else {
                    return highlightAuto(code).value;    
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
                    { this._renderTitle(this.props.article.title)}
                </div>
                <div className="markdown-body" dangerouslySetInnerHTML={ this._renderMarkup(this.props.article.content) } /> 
            </div>
        );
    }
}

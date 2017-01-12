"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'

var CodeMirror = require('react-codemirror');

require('codemirror/mode/markdown/markdown');
require('codemirror/mode/javascript/javascript');
require('codemirror/keymap/sublime');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/search');
require('codemirror/addon/search/matchesonscrollbar');
require('codemirror/addon/search/jump-to-line');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/comment/comment');
require('codemirror/addon/wrap/hardwrap');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/brace-fold');

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        requestArticle(this.props.params.articleNo);   
    }

    componentDidMount() {
        let { syncArticle, editArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        leaveArticle(this.props.params.articleNo);
        cleanArticle();
    }

    _handleBack () {
        let path = '/Article/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    render() {
        let article = this.props.state.article;
        let options = {
            lineNumbers: true,
            readOnly: true,
            mode: 'markdown',
            keyMap: 'sublime',
            extraKeys: { "Alt-F": "findPersistent" },
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true
        };

        return (
            <div className="ArticleContent">
                <div className="ArticlePage">
                    <ArticleTitle title={article.title} />
                    <CodeMirror value={article.content} options={options} />
                </div>
                <button type="button" className="Button" onClick={this._handleBack.bind(this)}>Return</button>
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

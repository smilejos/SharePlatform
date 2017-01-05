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
        let { requestArticle, editArticle } = this.props.actions;

        if (this._isRequestArticle()) {
            requestArticle(this.props.params.articleNo);   
        } else {
            editArticle(this.props.state.article, false);
        }
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

    _isRequestArticle(){
        return ( this.props.state.article.content == '');
    }

    _handleUpdate(article) {
        let { editArticle } = this.props.actions;
        editArticle(article, true);
    }

    _handleChange () {
        let temp = this.props.state.article ? this.props.state.article : {};
        temp.content = this.refs.textarea.value;
        this._handleUpdate(temp);
    }

    _handleBack () {
        let path = '/Article/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    _updateContent(content) {
        let temp = this.props.state.article ? this.props.state.article : {};
        temp.content = content;
        this._handleUpdate(temp);
    }

    _handleKeydown (e) {
        if (e.keyCode === 9) { // tab was pressed
            var val = this.refs.textarea.value,
                start = this.refs.textarea.selectionStart,
                end = this.refs.textarea.selectionEnd;
            this.refs.textarea.value = val.substring(0, start) + '\t' + val.substring(end);
            this.refs.textarea.selectionStart = this.refs.textarea.selectionEnd = start + 1;
            e.preventDefault();

            let temp = this.props.state.article;
            temp.content = this.refs.textarea.value;
            this._handleUpdate(temp);
        }
    }

    _handlePostArticle (){
        let { modifyArticle } = this.props.actions;
        let temp = this.props.state.article;
        temp.content = this.refs.textarea.value;
        
        modifyArticle(temp);
    }
    
    render() {
        let article = this.props.state.article;
        let options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'markdown',
            keyMap: 'sublime',
            extraKeys: { "Alt-F": "findPersistent" },
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
            indentUnit: 4
        };

        return (
            <div className="ArticleEditor">
                <div className="ArticleControl">
                    <i className="fa fa-eye fa-lg" />
                    <Link className="ArticleEdit" to={"/ArticlePreview/" + article.articleNo }>Preview</Link>
                </div>
                <div className="ArticleTitle">
                    {article.title}
                </div>
                <CodeMirror value={article.content} onChange={this._updateContent.bind(this)} options={options} />
                <button type="button" className="Button" onClick={this._handlePostArticle.bind(this)}>Post</button>
                <button type="button" className="Button" onClick={this._handleBack.bind(this)}>Return</button>
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

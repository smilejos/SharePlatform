"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import ArticleContent from '../article/ArticleContent'

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
        this.state = { isEditing: true };
        requestArticle(this.props.params.articleNo);
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

    _changeToEditMode() {
        this.setState({
            isEditing: true
        });
    }

    _changeToPreviewMode() {
        this.setState({
            isEditing: false
        });
    }

    _handleBack () {
        let path = '/Article/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    _updateContent(content) {
        let { editArticle } = this.props.actions;
        let temp = this.props.state.article ? this.props.state.article : {};
        temp.content = content;
        editArticle(article, true);
    }

    _renderContent(content) {
        if (this.state.isEditing) {
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
            return <CodeMirror value={content} onChange={this._updateContent.bind(this)} options={options} />
        } else {
            return <ArticleContent content={content } />
        }
    }

    _handleSaveArticle (){
        let { modifyArticle } = this.props.actions;
        let temp = this.props.state.article;
        modifyArticle(temp);
    }
    
    render() {
        let article = this.props.state.article;
        let content = this._renderContent.bind(this)(article.content);
        return (
            <div className="ArticleContent">
                <ArticleButton
                    isEditing={this.state.isEditing}
                    changeToEditMode={this._changeToEditMode.bind(this)}
                    changeToPreviewMode={this._changeToPreviewMode.bind(this)} />
                 <div className="ArticlePage">
                    <ArticleTitle title={article.title} />
                    {content}
                </div>
                <button type="button" className="Button" onClick={this._handleSaveArticle.bind(this)}>Save</button>
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

class ArticleButton extends React.Component {
    _changeToEditMode() {
        this.props.changeToEditMode();
    }

    _changeToPreviewMode() {
        this.props.changeToPreviewMode();
    }

    _renderPreviewButton() {
        return (
            <div className="btn-group-vertical">
                <span className="btn btn-default" onClick={this._changeToPreviewMode.bind(this)}>
                    <i className="fa fa-eye fa-lg" title="Preview" />
                </span>
            </div>
        )
    }

    _renderEditButton() {
        return (
            <div className="btn-group-vertical">
                <span className="btn btn-default" onClick={this._changeToEditMode.bind(this)}>
                    <i className="fa fa-edit fa-lg" title="Edit" />
                </span>
            </div>
        );
    }

    render() {
        let controlButton = null;
        if( this.props.isEditing) {
            controlButton = this._renderPreviewButton.bind(this)();
        } else {
            controlButton = this._renderEditButton.bind(this)();
        }

        return (
            <div className="ArticleControl">
                {controlButton}
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

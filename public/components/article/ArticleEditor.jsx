"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import NotificationSystem  from 'react-notification-system';
import * as ArticleActions from '../../actions/ArticleActions'

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

    _handleTitleChange () {
        let temp = this.props.state.article ? this.props.state.article : {};
        temp.title = this.refs.txtTitle.value;
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
        let { updateArticle, publishArticle } = this.props.actions;
        let temp = this.props.state.article;
        temp.content = this.refs.textarea.value;
        temp.title = this.refs.txtTitle.value;
        
        updateArticle(temp);
        this._addNotification();
    }

    _addNotification() {
        this._notification.addNotification({
            message: 'Notification message',
            level: 'success',
            autoDismiss: 3,
            position: 'bl'
        });
    }

    render() {
        let article = this.props.state.article;
        return (
            <div className="ArticleEditor">
                <div className="ArticleControl">
                    <i className="fa fa-eye fa-lg" />
                    <Link className="ArticleEdit" to={"/ArticlePreview/" + article.articleNo }>Preview</Link>
                </div>
                <input 
                    type="text" 
                    ref="txtTitle" 
                    placeholder="Article Title" 
                    className="ArticleTitle" 
                    value={ article.title } 
                    onChange={this._handleTitleChange.bind(this)} />
                <textarea
                    className="ArticleText"
                    onChange={this._handleChange.bind(this)}
                    onKeyDown={this._handleKeydown.bind(this)}
                    ref="textarea"
                    value = { article.content }/>
                <NotificationSystem ref="notification" />
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

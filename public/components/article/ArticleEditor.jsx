"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
    }

    _handleUpdate(article) {
        let { editArticle } = this.props.actions;
        editArticle(article);
    }

    _handleChange () {
        let temp = this.props.state.article;
        temp.Content = this.refs.textarea.value;
        this._handleUpdate(temp);
    }

    _handleTitleChange () {
        let temp = this.props.state.article;
        temp.Title = this.refs.txtTitle.value;
        this._handleUpdate(temp);
    }

    _handleKeydown () {
        if (e.keyCode === 9) { // tab was pressed
            var val = this.refs.textarea.value,
                start = this.refs.textarea.selectionStart,
                end = this.refs.textarea.selectionEnd;
            this.refs.textarea.value = val.substring(0, start) + '\t' + val.substring(end);
            this.refs.textarea.selectionStart = this.refs.textarea.selectionEnd = start + 1;
            e.preventDefault();

            let temp = this.props.state.article;
            temp.Content = this.refs.textarea.value;
            this._handleUpdate(temp);
        }
    }

    _handlePostArticle (){
        let { updateArticle } = this.props.actions;
        let temp = this.props.state.article;
        temp.Content = this.refs.textarea.value;
        temp.Title = this.refs.txtTitle.value;
        updateArticle(temp);
    }

    render() {
        return (
            <div className="ArticleEditor">
                <div className="ArticleControl">
                    <i className="fa fa-eye fa-lg" />
                    <Link className="ArticleEdit" to={ "/articlePreview/" + this.props.params.articleNo  }>Preview</Link>
                </div>
                <input 
                    type="text" 
                    ref="txtTitle" 
                    placeholder="Article Title" 
                    className="ArticleTitle" 
                    value={this.props.state.article.Title} 
                    onChange={this._handleTitleChange.bind(this)} />
                <textarea
                    className="ArticleText"
                    onChange={this._handleChange.bind(this)}
                    onKeyDown={this._handleKeydown.bind(this)}
                    ref="textarea"
                    defaultValue={this.props.state.article.Content} />
                <button ref="btn" className="ArticlePost" onClick={this._handlePostArticle.bind(this)}>Post</button>
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
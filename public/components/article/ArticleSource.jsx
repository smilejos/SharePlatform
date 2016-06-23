"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

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
        return (
            <div className="ArticleEditor">
                <div className="ArticleTitle">
                    {article.title}
                </div>
                <textarea
                    className="ArticleText"
                    readonly
                    ref="textarea"
                    value = { article.content }/>
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

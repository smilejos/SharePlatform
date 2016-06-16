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
        console.log('Preview _transferToPreview editArticle');
        editArticle(this.props.state.editingArticle, false);
    }
    
    render() {
        let content;
        let articleNo = this.props.params.articleNo != undefined ? this.props.params.articleNo : "New";
        if( this.props.state.editingArticle != null ) {
            content = <ArticleContent article = { this.props.state.editingArticle } />;
        } else {
            content = <div />;
        }  
        return (
            <div className="ArticleContent">
                <div className="ArticleControl">
                    <i className="fa fa-edit fa-lg" />
                    <Link className="ArticleEdit"  onClick={this._transferToPreview.bind(this)} to={"/ArticleEditor/" + articleNo}>Return to Edit</Link>
                </div>
                { content }
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


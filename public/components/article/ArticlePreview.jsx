"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import marked from 'marked'
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleContent from '../article/ArticleContent.jsx'

class Article extends React.Component {
    constructor(props){
        super(props);
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
                    <Link className="ArticleEdit" to={ "/articleEditor/" + this.props.params.articleNo  }>Return to Edit</Link>
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


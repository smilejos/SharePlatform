"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ArticleList from '../article/ArticleList'
import Category from '../search/Category'

class ArticleOverview extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        let { requestArticleList } = this.props.articleActions;
        var userId = this.props.userId;
        if( userId ) {
            requestArticleList({
                isSpecificUser: true,
                Id_No: userId
            });
        } else {
            requestArticleList({
                isSpecificUser: false
            });
        }
    }

     componentWillUnmount() {
        let { clearFilterCounts } = this.props.commonActions;
        let { clearFilterArticle } = this.props.articleActions;
        clearFilterArticle();
        clearFilterCounts();
    }

    componentWillReceiveProps(nextProps) {
        let { requestArticleList } = this.props.articleActions;
        if( nextProps.userId != this.props.userId ) {
            requestArticleList({
                isSpecificUser: true,
                Id_No: nextProps.userId
            });
        }
    }

    render() {
        return (
            <div className="ArticleOverview">
                <ArticleList/>
                <Category />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { }
}

function mapDispatchToProps(dispatch) {
    return { 
        articleActions: bindActionCreators(ArticleActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleOverview)
"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select';
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import ArticleList from '../article/ArticleList'
import Category from '../search/Category'

class Search extends React.Component {
    constructor(props){
        super(props);
        let { requestArticlesByTag, requestArticlesByAuthor } = this.props.articleActions;
        if( this.props.params.type == 'Tag' ) {
            requestArticlesByTag(this.props.params.keyword);
        } else {
            requestArticlesByAuthor(this.props.params.keyword);
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.keyword != this.props.params.keyword ||
            nextProps.params.type != this.props.params.type) {
            let { requestArticlesByTag, requestArticlesByAuthor } = this.props.articleActions;
            if (nextProps.params.type == 'Tag') {
                requestArticlesByTag(nextProps.params.keyword);
            } else {
                requestArticlesByAuthor(nextProps.params.keyword);
            }
        }
    }

    componentWillUnmount() {
        let { clearFilterCounts } = this.props.commonActions;
        let { clearFilterArticle } = this.props.articleActions;
        clearFilterArticle();
        clearFilterCounts();
    }

    render() {
        return (
            <div className="SearchSetting">
                <div className="Section">
                    <div className="Title">Article List</div>
                    <div className="Description">{'Retrival Article by ' +this.props.params.type+ ' : '+this.props.params.keyword}</div>
                </div>
                <div className="ArticleOverview">
                    <ArticleList />
                    <Category />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        articles: state.articleReducer.articles
    }
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
)(Search)

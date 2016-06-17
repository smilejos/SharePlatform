"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import * as ArticleActions from '../../actions/ArticleActions'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ArticleItem from '../article/ArticleItem'

class ArticleList extends React.Component {

    componentWillUnmount() {
        let { cleanArticles } = this.props.actions;
        cleanArticles();
    }

    render() {
        let list;
        if( this.props.articles && this.props.articles.length > 0) {
            list = this.props.articles.map(function(item, index){
                return <ArticleItem key={item.articleNo} article={item}  />
            });
        }
        return (
            <div className="ArticleList">
                {list}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { articles: state.articleReducer.articles }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleList)


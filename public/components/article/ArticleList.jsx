"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import * as ArticleActions from '../../actions/ArticleActions'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

class ArticleList extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        let { requestArticleList } = this.props.actions;
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

    componentWillReceiveProps(nextProps) {
        let { requestArticleList } = this.props.actions;
        if( nextProps.userId != this.props.userId ) {
            requestArticleList({
                isSpecificUser: true,
                Id_No: nextProps.userId
            });
        }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    render() {
        let list = null;
        if( this.props.list ) {
            list = this.props.list.map(function(item, index){
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

class ArticleItem extends React.Component {
    render() {
        return (
            <div className="ArticleActivity">
                <Link to={ "/user/" + this.props.article.author } className="ArticleAuthor">
                    { this.props.article.authorName }
                </Link>
                <span className="ArticleAction">
                    { moment(this.props.article.updateTime).isSame(this.props.article.publishTime ) ? "Publish" : "Update" }
                </span>
                <Link to={ "/article/" + this.props.article.articleNo } className="ArticleTitle">
                    { this.props.article.title }
                </Link>
                <span className="ArticleTime">{ moment( this.props.article.updateTime.replace("Z", "") ).fromNow() }</span>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { list: state.articleReducer.articles }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleList)

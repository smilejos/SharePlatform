"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import io from 'socket.io-client'
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

    componentWillReceiveProps() {
        //console.log('componentWillReceiveProps');
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    render() {
        var List = this.props.list.map(function(item, index){
            return <ArticleItem key={item.ArticleNo} Article={item}  />
        });
        return (
            <div className="ArticleList">
                {List}
            </div>
        );
    }
}

class ArticleItem extends React.Component {

    render() {
        return (
            <div className="ArticleActivity">
                <Link to={ "/user/" + this.props.Article.Author } className="ArticleAuthor">
                    { this.props.Article.AuthorName }
                </Link>
                <span className="ArticleAction">
                    { moment(this.props.Article.UpdateTime).isSame(this.props.Article.PublishTime ) ? "Publish" : "Update" }
                </span>
                <Link to={ "/article/" + this.props.Article.ArticleNo } className="ArticleTitle">
                    { this.props.Article.Title }
                </Link>
                <span className="ArticleTime">{ moment( this.props.Article.UpdateTime.replace("Z", "") ).fromNow() }</span>
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

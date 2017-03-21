"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'

class ArticleItem extends React.Component {
    render() {
        return (
            <div className="ArticleActivity">
                <Link to={ "/Page/User/" + this.props.article.author } className="ArticleAuthor">
                    { this.props.article.author_name }
                </Link>
                <span className="ArticleAction">
                    { moment(this.props.article.updateTime).isSame(this.props.article.publishTime ) ? "Publish" : "Update" }
                </span>
                <Link to={ "/Page/Article/View/" + this.props.article.articleNo } className="ArticleTitle">
                    { this.props.article.title }
                </Link>
                <span className="ArticleTime">{ moment( this.props.article.updateTime.replace("Z", "") ).fromNow() }</span>
                <ArticleTags tag={this.props.article.tag} />
            </div>
        );
    }
}

class ArticleTags extends React.Component {
    render() {
        let list;
        if( this.props.tag && this.props.tag.length > 0) {
            list = this.props.tag.map(function(item, index){
                return <ArticleTag key={index} value={item}  />
            });
        }
        return (
            <div className="ArticleTags">
                {list}
            </div>
        );
    }
}

class ArticleTag extends React.Component {
    render() {
        return (
            <Link to={ "/Page/Search/Result/Tag/" + this.props.value } className="ArticleTag">
                    { this.props.value }
            </Link>
        );
    }
}


export default ArticleItem

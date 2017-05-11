"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import Avatar from '../common/Avatar'

class ArticleInfo extends React.Component {

    _renderArticleInfo() {
        return (
            <div className="ArticleEditInfo">
                <Avatar worker_no={this.props.article.author} />
                <div className="information">
                    <div className="primaryText">{ "Publish Time" } </div>
                    <div className="secondaryText"> { moment( this.props.article.publishTime.replace("Z", "") ).fromNow() }</div>
                </div>
                {
                    (this.props.article.author != this.props.article.editor) ? <Avatar worker_no={this.props.article.editor} /> : null
                }
                <div className="information">
                    <div className="primaryText">{ "Last Update" } </div>
                    <div className="secondaryText"> { moment( this.props.article.updateTime.replace("Z", "") ).fromNow() }</div>
                </div>
            </div>
        );
    }
    render() {
        let content = this.props.isPresenting ? null : this._renderArticleInfo.bind(this)();
        return (
            <div>
                {content}
            </div>
        )
    }
}

export default ArticleInfo;

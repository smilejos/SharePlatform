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
    constructor(props) {
        super(props);    
    }

    componentWillMount() {
        this.setState({
             page_index: 0
        });
    }

    componentWillUnmount() {
        let { cleanArticles } = this.props.actions;
        cleanArticles();
    }

    _gotoPrevious() {
        if (this.state.page_index == 0)
            retrun  ;    
        this.setState({
            page_index: this.state.page_index - 1
        });
    }

    _gotoNext() {
        this.setState({
            page_index: this.state.page_index + 1
        });
    }

    render() {
        let list = [];
        let articles = this.props.isFilter ? this.props.filter_articles : this.props.articles;
        let minIndex = this.state.page_index * 10;
        let maxIndex = (this.state.page_index + 1) * 10;
        maxIndex = maxIndex > articles.length ? articles.length : maxIndex;
        let isMinPage = this.state.page_index == 0;
        let isMaxPage = maxIndex == articles.length;
        if (articles && maxIndex > 0) {
            for (let i = minIndex; i < maxIndex; i++){
                list.push(<ArticleItem key={articles[i].articleNo} article={articles[i]}  />)
            }
        }
        return (
            <div className="ArticleList">
                {list}
                <div className="btn-group">
                    <span className="btn btn-default" disabled={isMinPage ? "disabled" : ""} onClick={this._gotoPrevious.bind(this)}>
                        <i className="fa fa-chevron-left" title="Move to Previous"></i>
                    </span>
                    <span className="btn btn-default" disabled={isMaxPage ? "disabled" : ""} onClick={this._gotoNext.bind(this)}>
                        <i className="fa fa-chevron-right" title="Move to Next"></i>
                    </span>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        filter_articles: state.articleReducer.filter_articles,
        articles: state.articleReducer.articles,
        isFilter: state.articleReducer.isFilter
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleList)


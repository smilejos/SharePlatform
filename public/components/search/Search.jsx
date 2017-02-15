"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select';
import * as ArticleActions from '../../actions/ArticleActions'
import ArticleList from '../article/ArticleList'
import Category from '../search/Category'
import Toggle from 'react-toggle'

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPrivate: true,
            keyword: '',
            author: ''
        }
    }

    componentWillUnmount() {
        let { clearFilterArticle } = this.props.articleActions;
        clearFilterArticle();
    }

    _handleTypeChange() {
        this.setState({
            isPrivate: !this.state.isPrivate
        })
    }

    _handleKeywordChange() {
        this.setState({
            keyword: this.refs.txtKeyword.value
        });
    }

    _handleSearch() {
        let { searchArticles } = this.props.articleActions;
        searchArticles(this.state);
    }

    render() {
        let { category, articles } = this.props;
        return (
            <div className="SearchSetting">
                <div className="Section">
                    <div className="Title">Search Article</div>
                    <input type="text" ref="txtKeyword" value={ this.state.keyword } onChange={this._handleKeywordChange.bind(this)} />
                    <button type="button" className="btn btn-default" onClick={this._handleSearch.bind(this)}>
                        <i className="fa fa-search" aria-hidden="true"></i> Search
                    </button>
                    <Toggle
                        defaultChecked={this.state.isPrivate}
                        icons={{
                            checked: <i className="fa fa-user-secret fa-lg" />,
                            unchecked: <i className="fa fa-users fa-lg" />,
                        }}
                        onChange={this._handleTypeChange.bind(this)}>
                    </Toggle>
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
        category: state.commonReducer.category,
        articles: state.articleReducer.articles
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        articleActions: bindActionCreators(ArticleActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)

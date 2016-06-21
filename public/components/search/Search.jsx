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
    }

    componentWillUnmount() {
        let { clearFilterCounts } = this.props.commonActions;
        let { clearFilterArticle } = this.props.articleActions;
        clearFilterArticle();
        clearFilterCounts();
    }

    _handleTypeChange(selected_item) {
        let { setSearchOptions } = this.props.commonActions;
        setSearchOptions({
            isPrivate: (selected_item.value == "Private")
        });
    }

    _handleKeywordChange() {
        let { setSearchOptions } = this.props.commonActions;
        setSearchOptions({
            keyword: this.refs.txtKeyword.value
        });
    }

    _handleSearch() {
        let { searchArticles } = this.props.articleActions;
        searchArticles(this.props.options);
    }

    render() {
        let { category, options, articles } = this.props;
        let user =  [
            { value: 'Private', label: 'Private'},
            { value: 'Public', label: 'Public'}
        ];

        return (
            <div className="SearchSetting">
                <div className="Section">
                    <div className="Title">Search Article</div>
                    <input type="text" ref="txtKeyword" value={ options.keyword } onChange={this._handleKeywordChange.bind(this)} />
                    <button type="button" className="Button" onClick={this._handleSearch.bind(this)}>Search</button>
                    <Select name="form-field-name"
                            value={ options.isPrivate ? "Private" : "Public" } 
                            searchable={false}
                            options={user}
                            onChange={this._handleTypeChange.bind(this)} >
                    </Select>
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
        options: state.commonReducer.search_options,
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

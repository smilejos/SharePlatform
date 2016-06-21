"use strict";
import React from 'react'
import { render } from 'react-dom'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import {find, forEach, filter, orderBy, includes, isArray} from 'lodash'

class Category extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if( this.props.search_options.tag != nextProps.search_options.tag || 
            this.props.articles.length != nextProps.articles.length) {
            this._calculate(nextProps);
        }
    }

    _calculate(Props) {
        let { setCategoryCounts } = this.props.commonActions;
        if( Props.category.length > 0 && Props.articles.length > 0 ) {
            console.log('calculate');
            let result = Props.category.map(function(item, index){
                return {
                    name : item.name,
                    type : item.type,
                    count: 0
                }
            });

            forEach(Props.articles, function(article, index) {
                if(isArray(article.tag)) {
                    forEach(article.tag, function(item){
                        find(result, {name : item}).count ++;
                    })
                }
            });

            result = filter(result, function(o) { return o.count > 0; });
            result = orderBy(result, ['count'], ['desc']);
            setCategoryCounts(result);
        }
    }

    _handleFilter(name) {
        let { setSearchOptions } = this.props.commonActions;
        let { filterArticle } = this.props.articleActions;
        let result = filter(this.props.articles, function(article) { 
            return includes(article.tag, name); 
        });

        setSearchOptions({
            tag: name
        });

        filterArticle(result);
    }

    _handleClearFilter(name) {
        let { clearFilterOptions } = this.props.commonActions;
        let { clearFilterArticle } = this.props.articleActions;
        
        clearFilterArticle();
        clearFilterOptions();
    }

    render() {
        let list = null;
        let self = this;
        if( this.props.category_counts.length > 0 ) {
            list = this.props.category_counts.map(function(item, index){
                return <Tag 
                    key={index+1} 
                    name={item.name} 
                    tag={this.props.search_options.tag}
                    count={item.count}
                    handleFilter={this._handleFilter.bind(this)} />;
            }.bind(this));
            list.push(<Tag 
                    key={0} 
                    name={'Total'} 
                    tag={this.props.search_options.tag}
                    count={this.props.articles.length} 
                    handleFilter={this._handleClearFilter.bind(this)}/>);    
        }
        return (
            <div className={this.props.category_counts.length > 0 ? 'categoryList' : ''}>{list}</div>
        )
    }
}

class Tag extends React.Component {
    constructor(props){
        super(props);
    }

    _handleClick(name) {
        this.props.handleFilter(name);
    }

    render() {
        return (
            <div className={this.props.tag == this.props.name ? 'category active' : 'category'} onClick={this._handleClick.bind(this, this.props.name)}>
                <span className='name'>
                    {this.props.name}
                </span>
                <span className="count">{this.props.count}</span>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        category_counts: state.commonReducer.category_counts,
        author_counts: state.commonReducer.author_counts,
        search_options: state.commonReducer.search_options,
        category: state.commonReducer.category,
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
)(Category)

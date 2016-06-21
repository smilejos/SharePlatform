"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import {find, forEach, filter, orderBy, includes, isArray, uniqBy} from 'lodash'

class CategoryMap extends React.Component {
    constructor(props){
        super(props);
        let { requestTagSummary } = this.props.articleActions;
        requestTagSummary();
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.articles.length > 0 && this.props.articles.length != nextProps.articles.length) {
            this._calculate(nextProps);
        }
    }

    componentWillUnmount() {
        let { clearFilterCounts } = this.props.commonActions;
        let { cleanArticles } = this.props.articleActions;
        cleanArticles();
        clearFilterCounts();
    }

    _calculate(Props) {
        let { setCategoryCounts } = this.props.commonActions;
        if( Props.category.length > 0 && Props.articles.length > 0 ) {
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

            result = orderBy(result, ['type', 'count'], ['asc', 'desc']);
            setCategoryCounts(result);
        }
    }

    render() {
        let type = uniqBy(this.props.category, 'type');
        let list = type.map(function(item, index){
            let group = filter(this.props.category_counts, { 'type': item.type });
            return <CategoryGroup key={index} type={item.type} group={group} />
        }.bind(this));
        return (
            <div className="CategoryMap">
                {list}
            </div>
        )
    }
}

class CategoryGroup extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let list = this.props.group.map(function(item, index){
            return <CategoryItem key={index} item={item} />
        });
        return (
            <div className="CategoryGroup">
                <div className="CategoryGroupName">{this.props.type}</div>
                {list}
            </div>
        )
    }
}

class CategoryItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Link className="CategoryItem" to={ "/SearchResult/Tag/" + this.props.item.name }>
                <span className="name">{this.props.item.name}</span>
                <span className="count">{this.props.item.count}</span>
            </Link>
        )
    }
}

function mapStateToProps(state) {
    return { 
        category_counts: state.commonReducer.category_counts,
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
)(CategoryMap)

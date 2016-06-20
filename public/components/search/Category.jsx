"use strict";
import React from 'react'
import { render } from 'react-dom'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import {find, forEach, filter, orderBy, isArray} from 'lodash'

class Category extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if( this.props.search_options.tag != nextProps.search_options.tag || 
            this.props.articles.length != nextProps.articles.length) {
            console.log('enter calculate');
            console.log('tag', this.props.search_options.tag, nextProps.search_options.tag);
            console.log('articles', this.props.articles.length, nextProps.articles.length);
            this.calculate(nextProps);
        }
    }

    calculate(Props) {
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

            result = filter(result, function(o) { return o.count > 0; });
            result = orderBy(result, ['count'], ['desc']);
            setCategoryCounts(result);
        }
    }

    render() {
        let list = null;
        if( this.props.category_counts.length > 0 ) {
            list = this.props.category_counts.map(function(item, index){
                return <Tag key={index+1} name={item.name} count={item.count} />;
            });
            list.push(<Tag key={0} name={'Total'} count={this.props.articles.length} />);    
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

    render() {
        return (
            <div className="category">
                <span className="name">{this.props.name}</span>
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

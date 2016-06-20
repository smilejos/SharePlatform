"use strict";
import React from 'react'
import { render } from 'react-dom'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import {find, forEach, filter, isArray} from 'lodash'

class Search extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.calculate(nextProps);
    }

    calculate(Props) {
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
        }
    }

    render() {
        return (
            <div></div>
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
        articleActions: bindActionCreators(ArticleActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)

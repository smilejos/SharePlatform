"use strict";
import React from 'react'
import { render } from 'react-dom'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import {find, forEach, filter, orderBy, includes, isArray} from 'lodash'

class GroupMap extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
            </div>
        )
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
)(GroupMap)

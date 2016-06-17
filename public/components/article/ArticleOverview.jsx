"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import * as ArticleActions from '../../actions/ArticleActions'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ArticleList from '../article/ArticleList'

class ArticleOverview extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        let { requestArticleList } = this.props.actions;
        var userId = this.props.userId;
        if( userId ) {
            requestArticleList({
                isSpecificUser: true,
                Id_No: userId
            });
        } else {
            requestArticleList({
                isSpecificUser: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        let { requestArticleList } = this.props.actions;
        if( nextProps.userId != this.props.userId ) {
            requestArticleList({
                isSpecificUser: true,
                Id_No: nextProps.userId
            });
        }
    }

    render() {
        return (
            <ArticleList/>
        );
    }
}

function mapStateToProps(state) {
    return { }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleOverview)

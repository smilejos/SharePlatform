"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import Tooltip from 'rc-tooltip';
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleOverview from '../article/ArticleOverview'
import PersonalInfo from '../common/PersonalInfo'


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        //console.log("Personal.jsx componentDidMount");
    }

    componentDidUpdate() {
        //console.log("Personal.jsx componentDidUpdate");
    }

    _onArticleClick() {
        let { cleanArticle } = this.props.actions;
        cleanArticle();
    }

    _onAuthorClick() {
        
    }

    render() {
        let url = 'http://imgprod.micron.com/corp/emppics/Thumbnails/' +this.props.self.worker_no+ '.jpg';
        return (
            <div>
                <div className="personalBox">
                    <div className="image">
                        <img src={url}></img>
                    </div>
                    <PersonalInfo user= { this.props.self } />
                    <div className="control">
                        <div className="btn-group">
                            <Tooltip placement="top" animation="zoom" overlay="Publish Article">
                                <Link className="btn btn-default" to={ "/Page/Article/Creator" }>
                                    <i className="fa fa-pencil-square-o"></i>
                                </Link>
                            </Tooltip>
                            <Tooltip placement="top" animation="zoom" overlay="Create Book">
                                <Link className="btn btn-default" to={ "/Page/Book/Creator" }>
                                    <i className="fa fa-book"></i>
                                </Link>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <ArticleOverview worker_no= { this.props.self.worker_no } />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        self: state.memberReducer.self
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        actions: bindActionCreators(ArticleActions, dispatch) 
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

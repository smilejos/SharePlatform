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
import Avatar from '../common/Avatar'
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
        console.log('self', this.props.self);
        return (
            <div>
                <div className="personalBox">
                    <Avatar worker_no={this.props.self.worker_no} />
                    <PersonalInfo user= { this.props.self } />
                    <div className="control">
                        <div className="btn-group">
                            <Tooltip placement="top" animation="zoom" overlay="Publish Article">
                                <Link className="btn btn-default" to={ "/Page/Article/Creator" }>
                                    <i className="fa fa-pencil-square-o"></i>
                                </Link>
                            </Tooltip>
                            <Tooltip placement="top" animation="zoom" overlay="Create Book (This function is comming soon)">
                                <div className="btn btn-default" to={ "/Page/Book/Creator" }>
                                    <i className="fa fa-book"></i>
                                </div>
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

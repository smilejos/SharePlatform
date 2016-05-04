"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import io from 'socket.io-client'
import * as ArticleActions from '../../actions/ArticleActions'

import ArticleList from '../article/ArticleList.jsx'
import PersonalInfo from '../common/PersonalInfo.jsx'


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log("Personal.jsx componentDidMount");
    }

    componentDidUpdate() {
        console.log("Personal.jsx componentDidUpdate");
    }

    _onArticleClick() {
        let { cleanArticle } = this.props.actions;
        cleanArticle();
    }

    _onAuthorClick() {
        
    }

    render() {
        return (
            <div>
                <div className="personalBox">
                    <div className="image"></div>
                    <PersonalInfo user= { this.props.self } />
                    <div className="control">
                        <div className="controlItem">
                            <i className="fa fa-file-text-o"></i>
                            <Link to={ "/articleEditor" }>
                                Publish Article
                            </Link>    
                        </div>
                        <div className="controlItem">
                            <i className="fa fa-book"></i>
                            <Link to={ "/" }>
                                Create Book
                            </Link>
                        </div>
                    </div>
                </div>
                <ArticleList />
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

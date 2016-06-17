"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import * as MemberActions from '../../actions/MemberActions'

import ArticleList from '../article/ArticleList'
import PersonalInfo from '../common/PersonalInfo'

class App extends React.Component {
    constructor(props){
        super(props);
        let { getUser } = this.props.actions;
        getUser(this.props.params.userID);
    }
    
    render() {
        return (
            <div>
                <div className="personalBox">
                    <div className="image"></div>
                    <PersonalInfo user= { this.props.user } />
                </div>
                <ArticleList userId= { this.props.params.userID } />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        user: state.memberReducer.user
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(MemberActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import * as MemberActions from '../../actions/MemberActions'

import ArticleOverview from '../article/ArticleOverview'
import PersonalInfo from '../common/PersonalInfo'
import Category from '../search/Category'

class App extends React.Component {
    constructor(props){
        super(props);
        let { getUser } = this.props.actions;
        getUser(this.props.params.userID);
    }
    
    render() {
        let url = 'http://cweb01/HRIS/EmployeePhoto/photo2/' +this.props.user.Id_No+ '.jpg';
        return (
            <div>
                <div className="personalBox">
                    <div className="image">
                        <img src={url}></img>
                    </div>
                    <PersonalInfo user= { this.props.user } />
                </div>
                <ArticleOverview userId= { this.props.params.userID } />
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

"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import Tooltip from 'rc-tooltip';
import * as MemberActions from '../../actions/MemberActions'
import ArticleOverview from '../article/ArticleOverview'
import PersonalInfo from '../common/PersonalInfo'
import Avatar from '../common/Avatar'
class App extends React.Component {
    constructor(props){
        super(props);
        let { getUser } = this.props.actions;
        getUser(this.props.params.worker_no);
    }
    
    render() {
        return (
            <div>
                <div className="personalBox">
                    <Avatar worker_no={this.props.params.worker_no} />
                    <PersonalInfo user={this.props.user} />
                    <div className="control">
                        <div className="btn-group">
                            <Tooltip placement="top" animation="zoom" overlay="Phone Call">
                                <a className="btn btn-default" href={ "tel:" + this.props.user.tel_no}>
                                    <i className="fa fa-phone-square"></i>
                                </a>
                            </Tooltip>
                            <Tooltip placement="top" animation="zoom" overlay="Send E-Mail">
                                <a className="btn btn-default" href={ "mailto:" + this.props.user.email}>
                                    <i className="fa fa-envelope"></i>
                                </a>
                            </Tooltip>
                            <Tooltip placement="top" animation="zoom" overlay="Skype Message">
                                <a className="btn btn-default" href={ "sip:" + this.props.user.email}>
                                    <i className="fa fa-skype"></i>
                                </a>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <ArticleOverview worker_no= { this.props.params.worker_no } />
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

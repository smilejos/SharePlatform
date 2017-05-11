"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Menu from '../common/Menu'
import NotificationSystem  from 'react-notification-system';

class App extends React.Component {
    // componentWillMount() {
    //     console.log('Trace componentWillMount');
    // }

    // componentDidMount() {
    //     console.log('Trace componentDidMount');
    // }

    componentWillReceiveProps(nextProps) {
        if( nextProps.notice && this.props.notice.datetime !=  nextProps.notice.datetime) {
            this.refs.notification.addNotification({
                title: nextProps.notice.title,
                message: nextProps.notice.message,
                level: nextProps.notice.level,
                autoDismiss: nextProps.notice.autoDismiss ? nextProps.notice.autoDismiss : 3,
                position: 'bl'
            });
        }
    }

    // shouldComponentUpdate (object nextProps, object nextState) {
    //     console.log('Trace shouldComponentUpdate');
    //     return true;
    // } 

    // componentWillUpdate(object nextProps, object nextState) {
    //     console.log('Trace componentWillUpdate');
    // }

    // componentDidUpdate(object prevProps, object prevState) {
    //     console.log('Trace componentDidUpdate');
    // }

    // componentWillUnmount() {
    //     console.log('Trace componentWillUnmount');
    // }

    render() {
        //console.log(this.props.params);
        return (
            <div>
                <Menu />
                <div className="container">
                    {this.props.children}
                </div>
                <NotificationSystem ref="notification" />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { notice: state.commonReducer.notice }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

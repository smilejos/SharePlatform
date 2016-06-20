"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import Menu from '../common/Menu'
import { socket_common, socket_article } from '../../utility/socketHandler'

class App extends React.Component {

    // componentWillMount() {
    //     console.log('Trace componentWillMount');
    // }

    // componentDidMount() {
    //     console.log('Trace componentDidMount');
    // }

    // void componentWillReceiveProps(object nextProps)
    //     console.log('Trace componentWillReceiveProps');
    // }
    
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
            </div>
        )
    }
}

export default App;
"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import Menu from '../common/Menu'

class App extends React.Component {

    // componentWillMount() {
    //     console.log('Trace componentWillMount');
    // }

    // componentDidMount() {
    //     console.log('Trace componentDidMount');
    // }

    // componentWillReceiveProps() {
    //     console.log('Trace componentWillReceiveProps');
    // }
    
    // shouldComponentUpdate () {
    //     console.log('Trace shouldComponentUpdate');
    //     return true;
    // } 

    // componentWillUpdate() {
    //     console.log('Trace componentWillUpdate');
    // }

    // componentDidUpdate() {
    //     console.log('Trace componentDidUpdate');
    // }

    // componentWillUnmount() {
    //     console.log('Trace componentWillUnmount');
    // }

    render() {
        console.log(this.props.params);
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
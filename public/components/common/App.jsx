"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

class App extends React.Component {

    componentWillMount() {
        console.log('Trace componentWillMount');
    }

    componentDidMount() {
        console.log('Trace componentDidMount');
    }

    componentWillReceiveProps() {
        console.log('Trace componentWillReceiveProps');
    }
    
    shouldComponentUpdate () {
        console.log('Trace shouldComponentUpdate');
        return true;
    } 

    componentWillUpdate() {
        console.log('Trace componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('Trace componentDidUpdate');
    }

    componentWillUnmount() {
        console.log('Trace componentWillUnmount');
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default App;
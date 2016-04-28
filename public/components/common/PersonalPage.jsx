"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import io from 'socket.io-client'

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

    render() {
        return (
            <div>
                <div className="personalBox">
                    <div className="image"></div>
                    <PersonalInfo user= { this.props.self } />
                </div>
                <ArticleList userId= { this.props.self.Id_No } />
            </div>
        )
    }
}

function mapStateToProps(state) {
  return { 
        self: state.memberReducer.self
    }
}

export default connect(
  mapStateToProps
)(App)

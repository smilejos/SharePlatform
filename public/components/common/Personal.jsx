"use strict";
import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link } from 'react-router'
import io from 'socket.io-client'

import ArticleList from '../article/ArticleList.jsx'


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
            <div className="personalBox">
                <div className="image"></div>
                <Information selfUser= { this.props.self } />
            </div>
        )
    }
}

class Information extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="personal">
                <div className="information">
                    <div className="primaryText">
                        { this.props.selfUser.Dept_No + "-" + this.props.selfUser.Dept_Name } 
                    </div>
                    <div className="secondaryText"> 
                        { this.props.selfUser.Dept_FullName }
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.selfUser.Title_na } 
                    </div>
                    <div className="secondaryText"> 
                        
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.selfUser.Card_Na } 
                    </div>
                    <div className="secondaryText"> 
                        { "#" + this.props.selfUser.Tel_No }
                    </div>
                </div>
                <ArticleList userId= { this.props.selfUser.Id_No } />
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

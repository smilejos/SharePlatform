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
        console.log("props", this.props.state);
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    render() {
        //const { messages, dispatch } = this.props;
        return (
            <div className="personalBox">
                Hello
                <div className="image"></div>
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
  return { state: state }
}

export default connect(
  mapStateToProps,
  null
)(App)

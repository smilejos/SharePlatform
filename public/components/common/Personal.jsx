"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import io from 'socket.io-client'

import ArticleList from '../article/ArticleList.jsx'

class App extends React.Component {
    constructor(props){
        super(props);
        console.log("props", props);
        this.state = {
            isMenuOpen: false,
            memberList: [],
            chatChannel: [],
            selfUser: {},
            socket: null
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        if( ! this.state.socket ) {
             this.state.socket = io('/Common'); 
        }
        
        this.state.socket.on('receiveRealTimeMember', this._updateMemberList.bind(this));
    }

    _updateMemberList(data) {
        console.log('receiveRealTimeMember', data);
        this.setState({
            memberList : data.list,
            selfUser : data.self
        });
    }

    render() {
        console.log(this.state.selfUser);
        return (
            <div className="personalBox">
                <div className="image"></div>
                <Information selfUser={this.state.selfUser} />
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
export default App;
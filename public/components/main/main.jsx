"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Router, Link } from 'react-router'
import io from 'socket.io-client'
import { LeftNav, MenuItem, RaisedButton } from 'material-ui'

import CannelHandler from '../../client/utility/channelHandler'
import MemberList from '../common/memberList.jsx'
import ChatChannel from '../chat/chatChannel.jsx'

module.exports = React.createClass({
    getInitialState: function() {
        return {
            isMenuOpen: false,
            memberList: [],
            chatChannel: [],
            selfUser: {},
            socket: null
        };
    },
    componentDidMount: function() {
        console.log("componentDidMount");
        if( ! this.state.socket ) {
             this.state.socket = io('/Common'); 
        }
        
        this.state.socket.on('receiveRealTimeMember', this._updateMemberList);
        this.state.socket.on('openChat', this._receiveChatBoxOpen);
    },
    componentDidUpdate: function() {
        console.log("componentDidUpdate");
    },
    _updateMemberList: function(data) {
        console.log('receiveRealTimeMember', data);
        this.setState({
            memberList : data.list,
            selfUser : data.self
        });
    },
    _handleChatBoxOpen: function(item){
        console.log('send open', item);
        this.state.socket.emit('openChat', item);
        CannelHandler.setChannels(this.state.chatChannel);
        CannelHandler.openChatBox(item.Id_No);
        this.setState({
            chatChannel : CannelHandler.getChannels()
        });
    },
    _receiveChatBoxOpen: function(item){
        console.log('receive open', item);
        CannelHandler.setChannels(this.state.chatChannel);
        CannelHandler.openChatBox(item.Id_No);
        this.setState({
            chatChannel : CannelHandler.getChannels()
        });  
    },
    _sendMessage: function(message){
        console.log('send message', message)
        this.state.socket.emit('sendMessage', message);
        CannelHandler.setChannels(this.state.chatChannel);
        CannelHandler.postMessage(message);
        this.setState({
            chatChannel : CannelHandler.getChannels()
        });
    },
    _receiveMessage: function(message){
        console.log(message);
        CannelHandler.setChannels(this.state.chatChannel);
        CannelHandler.receiveMessage(message);
        this.setState({
            chatChannel : CannelHandler.getChannels()
        });
    },
    _handleLogin: function(){
        this.state.socket.emit('login', {
            IdNo: this.refs.txtIdNo.value
        });
    },
    _handleToggle: function () {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    },
    render: function() {
        console.log(this.state.chatChannel);
        return (
            <div>
                <RaisedButton label="Menu" onClick={this._handleToggle} />
                <LeftNav open={this.state.isMenuOpen} >
                    <MenuItem onClick={this._handleToggle}><Link to="/about">About</Link></MenuItem>
                    <MenuItem onClick={this._handleToggle}><Link to="/creation">Creation</Link></MenuItem>
                    <MenuItem onClick={this._handleToggle}><Link to="/list">Article</Link></MenuItem>
                    <MenuItem onClick={this._handleToggle}><Link to="/list/N81101">N81101</Link></MenuItem>
                    <MenuItem onClick={this._handleToggle}><Link to="/list/E10441">E10441</Link></MenuItem>
                </LeftNav>
                <MemberList memberList={this.state.memberList} openChatBox={this._handleChatBoxOpen} />
                <ChatChannel 
                    channels={this.state.chatChannel} 
                    memberList={this.state.memberList} 
                    selfUser={this.state.selfUser}
                    sendMessage={this._sendMessage} />
                <input type='text' ref='txtIdNo' />
                <button onClick={this._handleLogin} >login</button>
                {this.props.children}
            </div>
        );
    }
});
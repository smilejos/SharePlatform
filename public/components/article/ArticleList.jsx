"use strict";
import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import io from 'socket.io-client'

export default class ArticleList extends React.Component {
    constructor(props){
        super(props);
        console.log("componentDidMount", props.userId);
        this.state = { 
            list: [],
            socket: null
        };
    }

    componentDidMount() {
        // || this.props.params.userId
        var userId = this.props.userId;
        this.state.socket = io('/Article');
        console.log("componentDidMount", userId);
        if( userId ) {

            this.state.socket.emit('retrieveList', {
                isSpecificUser : true,
                Id_No : userId
            });
        } else {
            this.state.socket.emit('retrieveList', {
                isSpecificUser : false
            });
        }

        this.state.socket.on('receiveList', this._receiveList.bind(this));
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    _receiveList(list) {
        this.setState({
            list : list
        });
    }

    render() {
        console.log(this.state.list);
        var List = this.state.list.map(function(item, index){
            return <ArticleItem key={item.ArticleNo} Article={item}  />
        });
        return (
            <div className="ArticleList">
                {List}
            </div>
        );
    }
}

class ArticleItem extends React.Component {

    render() {
        console.log(this.props.Article);
        return (
            <div className="ArticleActivity">
                <Link to={ "/user/" + this.props.Article.Author } className="ArticleAuthor">
                    { this.props.Article.AuthorName }
                </Link>
                <span className="ArticleAction">
                    { moment(this.props.Article.UpdateTime).isSame(this.props.Article.PublishTime ) ? "Publish" : "Update" }
                </span>
                <Link to={ "/article/" + this.props.Article.ArticleNo } className="ArticleTitle">
                    { this.props.Article.Title }
                </Link>
                <span className="ArticleTime">{ moment( this.props.Article.UpdateTime.replace("Z", "") ).fromNow() }</span>
            </div>
        );
    }
}
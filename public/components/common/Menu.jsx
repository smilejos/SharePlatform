import React from 'react'
import { render } from 'react-dom'
import { Link, Redirect } from 'react-router'

export default class Information extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="Menu">
                <i className="fa fa-home"></i>
                <Link to={ "/" } className="MenuItem">
                    Home
                </Link>
                <i className="fa fa-group"></i>
                <Link to={ "/Group" } className="MenuItem">
                    Group
                </Link>
                <i className="fa fa-book"></i>
                <Link to={ "/" } className="MenuItem">
                    Books
                </Link>
                <i className="fa fa-tag"></i>
                <Link to={ "/Tag" } className="MenuItem">
                    Tag
                </Link>
                <i className="fa fa-search"></i>
                <Link to={ "/Search" } className="MenuItem">
                    Search
                </Link>                
            </div>
        )
    }
}
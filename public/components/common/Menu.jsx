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
                <Link to={ "/" } className="MenuItem">
                    Group
                </Link>
                <i className="fa fa-file-text-o"></i>
                <Link to={ "/" } className="MenuItem">
                    Articles
                </Link>
                <i className="fa fa-book"></i>
                <Link to={ "/" } className="MenuItem">
                    Books
                </Link>
                <i className="fa fa-search"></i>
                <Link to={ "/" } className="MenuItem">
                    Search
                </Link>                
            </div>
        )
    }
}
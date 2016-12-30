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
                <div className="btn-group">
                    <Link className="btn btn-default" to={ "/" }>
                        <i className="fa fa-home" title="Home"></i>
                     </Link>
                    <Link className="btn btn-default" to={ "/Group" }>
                        <i className="fa fa-group" title="Group"></i>
                     </Link>
                    <Link className="btn btn-default" to={ "/Tag" }>
                        <i className="fa fa-tag" title="Tag"></i>
                     </Link>
                    <Link className="btn btn-default" to={ "/Search" }>
                        <i className="fa fa-search" title="Search"></i>
                    </Link>
                     <Link className="btn btn-default" to={ "/Article/68" }>
                        <i className="fa fa-info" title="Log"></i>
                     </Link>
                </div>
            </div>
        )
    }
}
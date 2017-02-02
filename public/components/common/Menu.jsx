import React from 'react'
import { render } from 'react-dom'
import { Link, Redirect } from 'react-router'
import Tooltip from 'rc-tooltip';

export default class Information extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="Menu">
                <div className="logo"></div>
                <div className="btn-group">
                    <Tooltip placement="bottom" animation="zoom" overlay="Home Page">
                        <Link className="btn btn-default" to={ "/" }>
                            <i className="fa fa-home"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="Group">
                        <Link className="btn btn-default" to={ "/Group" }>
                            <i className="fa fa-group"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="Category">
                        <Link className="btn btn-default" to={ "/Tag" }>
                            <i className="fa fa-tag"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="Search">
                        <Link className="btn btn-default" to={ "/Search" }>
                            <i className="fa fa-search"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="System Log">
                        <Link className="btn btn-default" to={ "/Article/68" }>
                            <i className="fa fa-info"></i>
                        </Link>
                    </Tooltip>
                </div>
            </div>
        )
    }
}
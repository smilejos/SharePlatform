import React from 'react'
import { render } from 'react-dom'
import { Link, Redirect } from 'react-router'
import { stack as Menu } from 'react-burger-menu';
import Tooltip from 'rc-tooltip';
import Radium from 'radium';
let RadiumLink = Radium(Link);

export default class Information extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isVisiable: false
        }
    }

    _onMenuClick() {
        this.setState({
            isVisiable: !this.state.isVisiable
        })
    }

    _onLoginButtonClick() {

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
                        <Link className="btn btn-default" to={ "/Page/Group" }>
                            <i className="fa fa-group"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="Category">
                        <Link className="btn btn-default" to={ "/Page/Tag" }>
                            <i className="fa fa-tag"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="Search">
                        <Link className="btn btn-default" to={ "/Page/Search" }>
                            <i className="fa fa-search"></i>
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" animation="zoom" overlay="System Log">
                        <Link className="btn btn-default" to={ "/Page/Article/View/68" }>
                            <i className="fa fa-info"></i>
                        </Link>
                    </Tooltip>
                </div>
                <Menu isOpen={this.state.isVisiable} onClick={ this._onMenuClick }>
                    <RadiumLink className="menu-item" to="/">
                        <i className="fa fa-home"></i>
                        <span>Home</span>
                    </RadiumLink>
                    <RadiumLink className="menu-item" to="/Page/Group">
                        <i className="fa fa-group"></i>
                        <span>Group</span>
                    </RadiumLink>
                    <RadiumLink className="menu-item" to="/Page/Tag">
                        <i className="fa fa-tag"></i>
                        <span>Tag</span>
                    </RadiumLink>
                    <RadiumLink className="menu-item" to="/Page/Search">
                        <i className="fa fa-search"></i>
                        <span>Search</span>
                    </RadiumLink>
                    <RadiumLink className="menu-item" to="/Page/Article/68">
                        <i className="fa fa-info"></i>
                        <span>Information</span>
                    </RadiumLink>
                </Menu>
            </div>
        )
    }
}
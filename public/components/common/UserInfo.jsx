import React from 'react'
import { render } from 'react-dom'

export default class UserInfo extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="userInfo">
                <div className="primaryText">
                    { this.props.user.card_na } 
                </div>
                <div className="secondaryText"> 
                    { this.props.user.title_na } 
                </div>
                <div className="secondaryText">
                    { this.props.option ? this.props.option : this.props.user.dept_na } 
                </div>
            </div>
        )
    }
}


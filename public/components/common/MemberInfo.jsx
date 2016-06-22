import React from 'react'
import { render } from 'react-dom'

export default class MemberInfo extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="memberInfo">
                <div className="primaryText">
                    { this.props.user.card_na } 
                </div>
                <div className="secondaryText"> 
                    { this.props.user.title_na } 
                </div>
                <div className="secondaryText">
                    Article Count : { this.props.user.count }
                </div>
            </div>
        )
    }
}


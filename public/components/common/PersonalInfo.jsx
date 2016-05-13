import React from 'react'
import { render } from 'react-dom'

export default class Information extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="personal">
                <div className="information">
                    <div className="primaryText">
                        { this.props.user.dept_no + "-" + this.props.user.dept_na } 
                    </div>
                    <div className="secondaryText"> 
                        { this.props.user.dept_fullName }
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.user.title_na } 
                    </div>
                    <div className="secondaryText"> 
                        
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.user.card_na } 
                    </div>
                    <div className="secondaryText"> 
                        { "#" + this.props.user.tel_no }
                    </div>
                </div>
            </div>
        )
    }
}
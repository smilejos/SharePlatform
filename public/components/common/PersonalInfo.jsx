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
                        { this.props.user.Dept_No + "-" + this.props.user.Dept_Name } 
                    </div>
                    <div className="secondaryText"> 
                        { this.props.user.Dept_FullName }
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.user.Title_na } 
                    </div>
                    <div className="secondaryText"> 
                        
                    </div>
                </div>
                <div className="information">
                    <div className="primaryText">
                        { this.props.user.Card_Na } 
                    </div>
                    <div className="secondaryText"> 
                        { "#" + this.props.user.Tel_No }
                    </div>
                </div>
            </div>
        )
    }
}
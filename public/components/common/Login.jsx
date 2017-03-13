import React from 'react'
import { render } from 'react-dom'
import { facebook_login } from '../../utility/httpHandler'
export default class Login extends React.Component {
    constructor(props){
        super(props);
    }

    _onLogin() {
        facebook_login(function () { 
            console.log('success');
        });
    }

    render() {
        console.log(facebook_login);
        return (
             <div>
                <button onClick={this._onLogin}>click me to login</button>
            </div>
        )
    }
}
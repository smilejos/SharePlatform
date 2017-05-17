import React from 'react'
import { render } from 'react-dom'
import Avatar from '../common/Avatar'
import UserInfo from '../common/UserInfo'
class UserCard extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let { worker_no } = this.props.user;
        return (
            <div className="userCard">
                <Avatar worker_no={worker_no} />
                <UserInfo user = {this.props.user} option={this.props.option} />
            </div>
        )
    }
}


export default UserCard;

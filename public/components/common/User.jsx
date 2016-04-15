"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

class User extends React.Component {
  render() {
    const { userID } = this.props.params

    return (
      <div className="User">
        <h1>User id: {userID}</h1>
        <ul>
          <li><Link to={`/user/${userID}/tasks/foo`} activeClassName="active">foo task</Link></li>
          <li><Link to={`/user/${userID}/tasks/bar`} activeClassName="active">bar task</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default User;
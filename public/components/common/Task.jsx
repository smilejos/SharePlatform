"use strict";
import React from 'react'
import { render } from 'react-dom'

class Task extends React.Component {
  render() {
    const { userID, taskID } = this.props.params

    return (
      <div className="Task">
        <h2>User ID: {userID}</h2>
        <h3>Task ID: {taskID}</h3>
      </div>
    )
  }
}

export default Task;
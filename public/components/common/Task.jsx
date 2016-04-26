"use strict";
import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

class Task extends React.Component {
  	render() {
	    //const { userID, taskID } = this.props.params
	    let userID = "";
	    let taskID = "";
	    console.log(this.props.state);
	    return (
	      	<div className="Task">
	        	<h2>User ID: {userID}</h2>
	        	<h3>Task ID: {taskID}</h3>
	      	</div>
    	)
  	}
}

function mapStateToProps(state) {
  return { state: state }
}

export default connect(mapStateToProps)(Task)

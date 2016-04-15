"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/user/123" activeClassName="active">Bob</Link></li>
          <li><Link to="/user/abc" activeClassName="active">Sally</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default App;
"use strict";
import React from 'react'
import { render } from 'react-dom'

class Avatar extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        let url = 'http://imgprod.micron.com/corp/emppics/Thumbnails/' + this.props.worker_no + '.jpg';
        
        return (
            <div className="image">
                <img src={url}></img>
            </div>
        )
    }
}


export default Avatar;

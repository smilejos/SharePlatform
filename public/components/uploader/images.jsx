import React, { Component, PropTypes } from 'react'
import ReactCssTransitionGroup from 'react-addons-css-transition-group'

import Filename from './filename'
import Thumbnail from './thumbnail'
import Tooltip from 'rc-tooltip'

class Images extends Component {
    static propTypes = {
        className: PropTypes.string,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        className: '',
        'thumbnail-maxSize': 130
    }

    constructor() {
        super()
    }
    
    _onClick(id) {
        let UID = this.props.uploader.methods.getUuid(id);
        let FileName = this.props.uploader.methods.getName(id);
        let Article = this.props.articleNo;
        let path = `![](/${this.props.articleNo}/${UID}/${FileName})`;
        this.props.appendLine(path);
    }

    _renderImages(uploader) {
        return this.props.visibleFiles.map(({ id, status }) => (
            <li key={ id }  className='react-fine-uploader-gallery-file' >
                <Thumbnail className='react-fine-uploader-gallery-thumbnail' id={id} uploader={uploader} />
                <Tooltip placement="right" animation="zoom" overlay="Insert Image">
                    <div className="btn btn-default" onClick={ this._onClick.bind(this, id)}>
                        <i className="fa fa-external-link" />
                    </div>
                </Tooltip>
                <div className='react-fine-uploader-gallery-file-footer'>
                    <Filename className='react-fine-uploader-gallery-filename' id={id} uploader={uploader} />
                </div>
            </li>
        ))
    }

    render() {
        const uploader = this.props.uploader
        let images = this._renderImages(uploader);
        return (
            <ReactCssTransitionGroup className='react-fine-uploader-gallery-files'
                component='ul'
                transitionEnter={ !this.props.animationsDisabled }
                transitionEnterTimeout={ 500 }
                transitionLeave={ !this.props.animationsDisabled }
                transitionLeaveTimeout={ 300 }
                transitionName='react-fine-uploader-gallery-files'>
                {images}
            </ReactCssTransitionGroup>
        )
    }
}


export default Images

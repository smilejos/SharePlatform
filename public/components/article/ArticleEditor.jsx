"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Tooltip from 'rc-tooltip'

// internal related components or lib 
import store from '../../store/store';
import ArticleContent from '../article/ArticleContent'
import * as ArticleActions from '../../actions/ArticleActions'
import { receiveServerNotice } from '../../actions/CommonActions';
import { addArticleImage } from '../../actions/ArticleActions';

// react-fine-uploader related import
import Gallery from '../uploader/gallery'
import Images from '../uploader/images'
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Thumbnail from '../uploader/thumbnail'
import DeleteButton from '../uploader/delete-button'

// react-codemirror related import
var CodeMirror = require('../codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/javascript/javascript');
require('codemirror/keymap/sublime');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/search');
require('codemirror/addon/search/matchesonscrollbar');
require('codemirror/addon/search/jump-to-line');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/comment/comment');
require('codemirror/addon/wrap/hardwrap');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/brace-fold');

const uploader = new FineUploaderTraditional({
    options: {
        //debug: true,
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: '/uploads'
        },
        request: {
            endpoint: '/uploads'
        },
        retry: {
            enableAuto: true
        },
        callbacks: {
            onComplete: function (id, name, item) {
                item.id = id;
                store.dispatch(receiveServerNotice({
                    level: 'success',
                    message: 'Image ' + name + ' upload success.',
                    datetime: Date.now()
                }));
                store.dispatch(addArticleImage(item));
            },
            onDeleteComplete: function () { 
                
            },
            onError: function (id, name, errorReason) {
                store.dispatch(receiveServerNotice({
                    level: 'error',
                    message: errorReason,
                    datetime: Date.now()
                }));
            }
        }
    }
})

class Article extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mode: 'Edit',       // Edit, Preview, Gallery, Upload
            newline: '',        // New content for in new line
            pickedImages: [],       // Picked images list
            options: {
                lineNumbers: true,
                readOnly: false,
                mode: 'markdown',
                keyMap: 'sublime',
                extraKeys: { "Alt-F": "findPersistent" },
                autoCloseBrackets: true,
                matchBrackets: true,
                showCursorWhenSelecting: true,
                indentUnit: 4
            },
            visibleFiles: [],
            scrollInfo: null,
            cursorInfo: null
        };

        this._onStatusChange = (id, oldStatus, status) => {
            if (status === 'submitted') {
                const visibleFiles = this.state.visibleFiles

                visibleFiles.push({ id })
                this.setState({ visibleFiles })
            }
            else if (isFileGone(status)) {
                this._removeVisibleFile(id)
            }
            else if (status === 'upload successful' || status === 'upload failed') {
                this._updateVisibleFileStatus(id, status)
            }
        }     
    }

    componentWillMount() {
        let { requestArticle, requestArticleImages } = this.props.actions;
        requestArticle(this.props.params.articleNo);
        requestArticleImages(this.props.params.articleNo);

        // Assign additional parameter in post-form
        // To deliver articleNo to server to store articleNo in image table 
        uploader.methods.setParams({
            articleNo: this.props.params.articleNo
        });

        uploader.methods.setDeleteFileParams({
            articleNo: this.props.params.articleNo
        });
    }

    componentDidMount() {
        let { syncArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);

        uploader.on('statusChange', this._onStatusChange);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        leaveArticle(this.props.params.articleNo);
        cleanArticle();
    }

    componentWillReceiveProps(nextProps) {
        // We wait for react-fine-uploader provide addInitialFiles function
        if (nextProps.state.images && this.props.state.images.length == 0) {
            let list = nextProps.state.images.map((item, index) => {
                return {
                    id: item.id,
                    name: item.fileName,
                    uuid: item.UID,
                    size: item.fileSize,
                    thumbnailUrl: '/' + item.articleNo + "/" + item.UID + "/" + item.fileName,
                    deleteFileEndpoint: '/uploads',
                    deleteFileParams: {
                        articleNo: item.articleNo
                    }
                };
            });
            let visibleFiles = nextProps.state.images.map((item, id) => {
                return {
                    id: item.id,
                    status: 'upload successful'
                }
            });

            this.setState({ visibleFiles: visibleFiles });
            uploader.methods.addInitialFiles(list);
        }
    }

    _removeVisibleFile(id) {
        let visibleFileIndex = -1

        this.state.visibleFiles.some((file, index) => {
            if (file.id === id) {
                visibleFileIndex = index
                return true
            }
        })

        if (visibleFileIndex >= 0) {
            const visibleFiles = this.state.visibleFiles
            visibleFiles.splice(visibleFileIndex, 1)
            this.setState({ visibleFiles })
        }
    }

    _updateVisibleFileStatus(id, status) {
        this.state.visibleFiles.some(file => {
            if (file.id === id) {
                file.status = status
                this.setState({ visibleFiles: this.state.visibleFiles })
                return true
            }
        })
    }

    _changeMode(mode) {
        this.setState({
            newline: "",
            mode: mode
        });
    }

    _handleBack () {
        let path = '/Page/Article/View/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    _updateContent(content) {
        let { editArticle } = this.props.actions;
        let temp = this.props.state.article ? this.props.state.article : {};
        temp.content = content;
        editArticle(temp, true);
    }

    _editorScroll(scrollInfo) {
        this.setState({
            scrollInfo: scrollInfo
        });
    }

    _cursorChanged(cursorInfo) {
        this.setState({
            cursorInfo: cursorInfo,
            newline: null
        });
    }

    _renderContent(content) {
        switch (this.state.mode) {
            case "Edit":
                return <CodeMirror
                    value={content}
                    newline={this.state.newline}
                    scrollInfo={this.state.scrollInfo}
                    cursorInfo={this.state.cursorInfo}
                    onChange={this._updateContent.bind(this)}
                    onScroll={this._editorScroll.bind(this)}
                    onCursorChanged={this._cursorChanged.bind(this)}
                    options={this.state.options} />
            case "Preview":
                return <ArticleContent content={content} />;
            case "Upload":
                return <Gallery
                    deleteButton-onlyRenderIfDeletable={false}
                    visibleFiles={this.state.visibleFiles}
                    uploader={uploader} />; 
            case "Gallery":
                return <Images
                    visibleFiles={this.state.visibleFiles}
                    uploader={uploader}
                    appendLine={this._appendLineToCodeMirror.bind(this)}
                    pickImage={this._pickImage.bind(this)}
                    pickedImages={this.state.pickedImages}
                    articleNo={this.props.params.articleNo} />;
        }
    }

    _pickImage(id) {
        let pickedImages = this.state.pickedImages;
        let index = pickedImages.indexOf(id);
        if (index > -1) {
            pickedImages.splice(index, 1);
        } else {
            pickedImages.push(id);
        }
        this.setState({
            pickedImages: pickedImages
        });
    }

    _handleInsertImage() {
        let multiLine = "";
        let Article = this.props.params.articleNo;
        this.state.pickedImages.forEach(function (id) { 
            let UID = uploader.methods.getUuid(id);
            let FileName = uploader.methods.getName(id);
            let path = `![](/${Article}/${UID}/${FileName})`;
            multiLine = multiLine + path + "\n";
        })
        
        this.setState({
            mode: "Edit",
            newline: multiLine,
            pickedImages: []
        });
    }

    _appendLineToCodeMirror(newline) {
        this.setState({
            mode: "Edit",
            newline: newline
        });
    }

    _handleSaveArticle (){
        let { modifyArticle } = this.props.actions;
        let temp = this.props.state.article;
        modifyArticle(temp);
    }
    
    render() {
        let article = this.props.state.article;
        let content = this._renderContent.bind(this)(article.content);
        return (
            <div className="ArticleContent">
                <ArticleButton
                    mode={this.state.mode}
                    isEditing={this.state.isEditing}
                    changeMode={this._changeMode.bind(this)} />
                    
                <div className="ArticlePage">
                    <ArticleTitle title={article.title} />
                    {content}
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-default" onClick={this._handleSaveArticle.bind(this)}>
                        <i className="fa fa-file"/> Save
                    </button>
                    <button type="button" className="btn btn-default" onClick={this._handleBack.bind(this)}>
                        <i className="fa fa-window-close"/> Cancel
                    </button>
                    {
                        this.state.pickedImages.length > 0 &&
                        <button type="button" className="btn btn-default" onClick={this._handleInsertImage.bind(this)}>
                            <i className="fa fa-window-close"/> Batch Insert
                        </button>
                    }
                </div>
            </div>
        );
    }
}

class ArticleTitle extends React.Component {
    render() {
        return (
            <div className="ArticleTitle">
                <span>{this.props.title}</span>
            </div>
        )
    }
}

class ArticleButton extends React.Component {
    _changeMode(mode) {
        this.props.changeMode(mode);
    }

    render() {
        return (
            <div className="ArticleControl">
                <div className="btn-group-vertical">
                    <Tooltip placement="right" animation="zoom" overlay="Preview">
                        <span className= {"btn btn-default " + (this.props.mode == "Preview" ? "active" : "")} onClick={this._changeMode.bind(this, 'Preview')}>
                            <i className="fa fa-eye fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Image Upload">
                        <span className={"btn btn-default " + (this.props.mode == "Upload" ? "active" : "")} onClick={this._changeMode.bind(this, 'Upload')}>
                            <i className="fa fa-upload fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Image Gallery">
                        <span className={"btn btn-default " + (this.props.mode == "Gallery" ? "active" : "")} onClick={this._changeMode.bind(this, 'Gallery')}>
                            <i className="fa fa-file-image-o fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Edit">
                        <span className={"btn btn-default " + (this.props.mode == "Edit" ? "active" : "")} onClick={this._changeMode.bind(this, 'Edit')}>
                            <i className="fa fa-edit fa-lg"/>
                        </span>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}

function mapStateToProps(state) {
    return { state: state.articleReducer }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)

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
        let { requestArticle, requestArticleImages } = this.props.actions;
        this.state = {
            mode: 'Edit',       // Edit, Preview, Gallery, Upload
            text: '',           // New content for in new line
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
        requestArticle(this.props.params.articleNo);
        requestArticleImages(this.props.params.articleNo);
    }

    componentWillMount() {
        // Assign additional parameter in post-form
        // To deliver articleNo to server to store articleNo in image table 
        uploader.methods.setParams({
            articleNo: this.props.params.articleNo
        });

        uploader.methods.setDeleteFileParams({
            articleNo: this.props.params.articleNo
        });
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
                return { id: item.id }
            });

            this.setState({ visibleFiles: visibleFiles });
            uploader.methods.addInitialFiles(list);
        }
    }
    
    componentDidMount() {
        let { syncArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        leaveArticle(this.props.params.articleNo);
        cleanArticle();
    }

    _changeMode(mode) {
        this.setState({
            text: "",
            mode: mode
        });
    }

    _handleBack () {
        let path = '/Article/' + this.props.params.articleNo;
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
            cursorInfo: cursorInfo
        });
    }

    _renderContent(content) {
        switch (this.state.mode) {
            case "Edit":
                return <CodeMirror
                    value={content}
                    text={this.state.text}
                    scrollInfo={this.state.scrollInfo}
                    cursorInfo={this.state.cursorInfo}
                    onChange={this._updateContent.bind(this)}
                    onScroll={this._editorScroll.bind(this)}
                    onCursorChanged={this._cursorChanged.bind(this)}
                    options={this.state.options} />
            case "Preview":
                return <ArticleContent content={content} />;
            case "Upload":
                return <Gallery deleteButton-onlyRenderIfDeletable={false}  visibleFiles={this.state.visibleFiles} uploader={uploader} />; 
            case "Gallery":
                return <Images visibleFiles={this.state.visibleFiles} uploader={uploader} appendLine={this._appendLineToCodeMirror.bind(this)} articleNo={this.props.params.articleNo} />;
        }
    }

    _appendLineToCodeMirror(text) {
        this.setState({
            mode: "Edit",
            text: text
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
                    isEditing={this.state.isEditing}
                    changeMode={this._changeMode.bind(this)} />
                    
                <div className="ArticlePage">
                    <ArticleTitle title={article.title} />
                    {content}
                </div>
                <button type="button" className="Button" onClick={this._handleSaveArticle.bind(this)}>Save</button>
                <button type="button" className="Button" onClick={this._handleBack.bind(this)}>Return</button>
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
                        <span className="btn btn-default" onClick={this._changeMode.bind(this, 'Preview')}>
                            <i className="fa fa-eye fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Edit">
                        <span className="btn btn-default" onClick={this._changeMode.bind(this, 'Edit')}>
                            <i className="fa fa-edit fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Image Upload">
                        <span className="btn btn-default" onClick={this._changeMode.bind(this, 'Upload')}>
                            <i className="fa fa-upload fa-lg"/>
                        </span>
                    </Tooltip>
                    <Tooltip placement="right" animation="zoom" overlay="Image Gallery">
                        <span className="btn btn-default" onClick={this._changeMode.bind(this, 'Gallery')}>
                            <i className="fa fa-file-image-o fa-lg"/>
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

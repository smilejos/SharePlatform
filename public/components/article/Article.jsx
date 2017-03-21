"use strict";
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import screenfull from 'screenfull';
import Dropzone from 'react-dropzone'
import Tooltip from 'rc-tooltip';
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'
import ArticleContent from '../article/ArticleContent'
import FileSaver from 'file-saver'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        requestArticle(this.props.params.articleNo);
    }

    componentWillReceiveProps(nextProps) {
        let { requestArticle, leaveArticle, cleanArticle } = this.props.actions;
        if( this.props.params.articleNo != nextProps.params.articleNo) {
            requestArticle(nextProps.params.articleNo);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        // Make sure content already download from server
        // if( nextProps.state.article.articleNo != null) {
        //     console.log('shouldComponentUpdate', nextProps.state.article.articleNo);
        //     return true;
        // } else {
        //     return false;
        // }

        return true;
    }

    componentDidMount() {
        let { syncArticle } = this.props.actions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.actions;
        cleanArticle();
        leaveArticle(this.props.params.articleNo);
    }

    _startSildeshow() {
        let enabled = screenfull.enabled;
        if( enabled ) {
            let dom = findDOMNode(this.refs.content);
            screenfull.request(dom);    
        }
        this._nextSildeshow();
    }

    _existSildeshow() {
        let { updateSlideIndex } = this.props.actions;
        let enabled = screenfull.enabled;
        if( enabled ) {
            screenfull.exit();
        }
        updateSlideIndex(-1);
    }

    _nextSildeshow() {
        let { updateSlideIndex } = this.props.actions;
        let index = this.props.state.slide_index + 1;
        if( index > this.props.state.slides.length - 1) {
            index = this.props.state.slides.length - 1;
        }
        updateSlideIndex(index);
    }

    _prevSildeshow() {
        let { updateSlideIndex } = this.props.actions;
        let index = this.props.state.slide_index - 1;
        if( index < 0) {
            index = 0;
        }
        updateSlideIndex(index);
    }

    _fileUpload() {
        this.refs.dropzone.open();
    }

    _fileDownload() {
        var blob = new Blob([this.props.state.article.content], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, this.props.state.article.articleNo + ".md");
    }

    _onFileUpload(files) {
        console.log(files);
        let { uploadArticle } = this.props.actions;
        uploadArticle(files, this.props.params.articleNo);
    }

    _isPresenting() {
        return this.props.state.slide_index > -1;
    }

    _renderContent() {
        let isPresenting = this.props.state.slide_index > -1;
        let content = isPresenting ? this.props.state.slides[this.props.state.slide_index] : this.props.state.article.content; 
        return (
            <div>
                <ArticleButton 
                    article={this.props.state.article} 
                    worker_no={this.props.self.worker_no} 
                    startSildeshow={this._startSildeshow.bind(this)}
                    existSildeshow={this._existSildeshow.bind(this)}
                    prevSildeshow={this._prevSildeshow.bind(this)}
                    nextSildeshow={this._nextSildeshow.bind(this)}
                    fileUpload={this._fileUpload.bind(this)}
                    fileDownload={this._fileDownload.bind(this)}
                    isPresenting={isPresenting}
                    content={content}
                />
                <div className="ArticlePage">
                    <ArticleTitle title={this.props.state.article.title} />
                    <ArticleContent content={content } />
                    <ArticleFooter 
                        article={this.props.state.article} 
                        maxIndex={this.props.state.slides.length}
                        currentIndex={this.props.state.slide_index} />
                </div>
                <div className="ArticleUpload">
                    <Dropzone onDrop={this._onFileUpload.bind(this)} ref="dropzone"></Dropzone>
                </div>
                
            </div>
        );
    }

    _renderLoading() {
        return (
            <div className="ArticleLoading">
                <i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    render() {
        let content;
        if ( this.props.state.article.articleNo != null ) {
            content = this._renderContent.bind(this)();
        } else {
            content = this._renderLoading();
        }
        
        return (
            <div ref="content" className={this.props.state.slide_index  > -1 ? "ArticleSlideShow" : "ArticleContent"}>
                {content}
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

class ArticleFooter extends React.Component {
    render() {
        return (
            <div className="ArticleFooter">
                <div>
                    <div className="PageInfo">{ this.props.currentIndex+1 + "/" + this.props.maxIndex  }</div>
                </div>
                <div>
                    <div className="Author"> {this.props.article.author_name}</div>
                </div>
            </div>
        )
    }
}

class ArticleButton extends React.Component {
    _startSildeshow() {
        this.props.startSildeshow();
    }

    _existSildeshow() {
        this.props.existSildeshow();
    }

    _prevSildeshow() {
        this.props.prevSildeshow();
    }

    _nextSildeshow() {
        this.props.nextSildeshow();
    }

    _fileUpload() {
        this.props.fileUpload();
    }

    _fileDownload() {
        this.props.fileDownload();
    }

    _renderAuthorSettingAction() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="Article Setting">
                <Link className="btn btn-default" to={ "/Page/Article/Setting/" + this.props.article.articleNo }>
                    <i className="fa fa-cog fa-lg"></i>
                </Link>
            </Tooltip>
        )
    }
    _renderAuthorEditAction() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="Edit Article">
                <Link className="btn btn-default" to={ "/Page/Article/Editor/" + this.props.article.articleNo }>
                    <i className="fa fa-edit fa-lg"></i>
                </Link>
            </Tooltip>
        );
    }

    _renderDefaultSourceButton() {
         return (
            <Tooltip placement="right" animation="zoom" overlay="View Source">
                <Link className="btn btn-default" to={ "/Page/Article/Source/" + this.props.article.articleNo }>
                    <i className="fa fa-eye fa-lg"></i>
                </Link>
            </Tooltip>
        );
    }

    _renderDefaultDownloadButton() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="Markdown Download">
                <span className="btn btn-default" onClick={this._fileDownload.bind(this)}>
                    <i className="fa fa-download fa-lg"/>
                </span>
            </Tooltip>
        );
    }

    _renderPDFDownloadButton() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="PDF Download">
                <a className="btn btn-default" href={"/download/" + this.props.article.articleNo} target="_blank">
                    <i className="fa fa-file-pdf-o fa-lg"/>
                </a>
            </Tooltip>
        );
    }

    _renderSlideshowButton() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="SlideShow">
                <span className="btn btn-default" onClick={this._startSildeshow.bind(this)}>
                    <i className="fa fa-laptop fa-lg"/>
                </span>
            </Tooltip>    
        );
    }

    _renderPresentingButton() {
        return (
            <span>
                <i className="fa fa-chevron-circle-left fa-lg" />
                <span className="ArticleEdit" onClick={this._prevSildeshow.bind(this)}>Prev</span>
                <i className="fa fa-chevron-circle-right fa-lg" />
                <span className="ArticleEdit" onClick={this._nextSildeshow.bind(this)}>Next</span>
                <i className="fa fa-sign-out fa-lg" />
                <span className="ArticleEdit" onClick={this._existSildeshow.bind(this)}>Exist</span>
            </span>
        );
    }

    render() {
        let defaultSourceButton = null,
            defaultDownloadButton = null,
            defaultPDFButton = null,
            authorSettingButton = null,
            authorEditButton = null,
            slideshowButton = null,
            presentingButton = null;

        if( this.props.article != null && this.props.isPresenting ) {
            presentingButton = this._renderPresentingButton.bind(this)();
        } else if( this.props.article != null) {
            defaultSourceButton = this._renderDefaultSourceButton.bind(this)();
            defaultDownloadButton = this._renderDefaultDownloadButton.bind(this)();
            defaultPDFButton = this._renderPDFDownloadButton.bind(this)();
            authorSettingButton = this.props.article.author == this.props.worker_no ? this._renderAuthorSettingAction.bind(this)() : null;
            authorEditButton = this.props.article.author == this.props.worker_no ? this._renderAuthorEditAction.bind(this)() : null;
            slideshowButton = this.props.article.isSlideshow ? this._renderSlideshowButton.bind(this)() : null;
        }

        return (
            <div className="ArticleControl">
                <div className="btn-group-vertical">
                    {presentingButton}
                    {slideshowButton}
                    {defaultSourceButton}
                    {defaultDownloadButton}
                    {defaultPDFButton}
                    {authorSettingButton}
                    {authorEditButton}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        state: state.articleReducer,
        self: state.memberReducer.self
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ArticleActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)


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
import * as CommonActions from '../../actions/CommonActions'
import ArticleContent from '../article/ArticleContent'
import ArticleInfo from '../article/ArticleInfo'
import FileSaver from 'file-saver'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.articleActions;
        requestArticle(this.props.params.articleNo);
    }

    componentWillReceiveProps(nextProps) {
        let { requestArticle, leaveArticle, cleanArticle } = this.props.articleActions;
        if( this.props.params.articleNo != nextProps.params.articleNo) {
            requestArticle(nextProps.params.articleNo);
        }
    }

    componentDidUpdate() {
        /// To-Do: Wait to check scroll behavior when document presenting and change page.
    }

    componentDidMount() {
        let { syncArticle } = this.props.articleActions;
        syncArticle(this.props.params.articleNo);
    }
    
    componentWillUnmount() {
        let { leaveArticle, cleanArticle } = this.props.articleActions;
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
        let { updateSlideIndex } = this.props.articleActions;
        let enabled = screenfull.enabled;
        if( enabled ) {
            screenfull.exit();
        }
        updateSlideIndex(-1);
    }

    _nextSildeshow() {
        let { updateSlideIndex } = this.props.articleActions;
        let index = this.props.state.slide_index + 1;
        if( index > this.props.state.slides.length - 1) {
            index = this.props.state.slides.length - 1;
        }
        updateSlideIndex(index);
    }

    _prevSildeshow() {
        let { updateSlideIndex } = this.props.articleActions;
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
        let { uploadArticle } = this.props.articleActions;
        uploadArticle(files, this.props.params.articleNo);
    }

    _scrollToTop() {
        document.getElementsByClassName("container")[0].scrollTop = 0;
    }

    _scrollToBottom() {
        let node = findDOMNode(this.refs.content);
        document.getElementsByClassName("container")[0].scrollTop = node.scrollHeight;
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
                    scrollToTop={this._scrollToTop.bind(this)}
                    scrollToBottom={this._scrollToBottom.bind(this)}
                    isPresenting={isPresenting}
                    commonActions= {this.props.commonActions}
                />
                <ArticleInfo
                    article={this.props.state.article}
                    isPresenting={isPresenting}
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
            </div>
        )
    }
}

class ArticleButton extends React.Component {
    _isAllowToEdit() {
        let isAuthor = this.props.article.author == this.props.worker_no;
        let isCoEditor = this.props.article.editors.indexOf(this.props.worker_no) > -1;
        if (isCoEditor) {
            let { sentClientNotice } = this.props.commonActions;
            sentClientNotice({
                level : 'info',
                title : 'System Notice',
                message: 'You are authorized to edit this article by author.',
                autoDismiss: 5,
                datetime: Date.now()
            });
        }
        return isAuthor || isCoEditor;
    }

    _isAuthor() {
        return this.props.article.author == this.props.worker_no;
    }

    _renderAuthorSettingButton() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="Article Setting">
                <Link className="btn btn-default" to={ "/Page/Article/Setting/" + this.props.article.articleNo }>
                    <i className="fa fa-cog fa-lg"></i>
                </Link>
            </Tooltip>
        )
    }

    _renderAuthorAssignButton() {
        return (
            <Tooltip placement="right" animation="zoom" overlay="Assign Co-Editor">
                <Link className="btn btn-default" to={ "/Page/Article/Assign/" + this.props.article.articleNo }>
                    <i className="fa fa-address-book fa-lg"></i>
                </Link>
            </Tooltip>
        )
    }

    _renderArticleEditButton() {
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
                <span className="btn btn-default" onClick={this.props.fileDownload}>
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
                <span className="btn btn-default" onClick={this.props.startSildeshow}>
                    <i className="fa fa-laptop fa-lg"/>
                </span>
            </Tooltip>    
        );
    }

    _renderScrollButton() {
        return (
            <div className="btn-group-vertical">
                <Tooltip placement="right" animation="zoom" overlay="Scroll to top">
                    <span className="btn btn-default" onClick={this.props.scrollToTop}>
                        <i className="fa fa-arrow-circle-up fa-lg"/>
                    </span>
                </Tooltip>
                <Tooltip placement="right" animation="zoom" overlay="Scroll to bottom">
                    <span className="btn btn-default" onClick={this.props.scrollToBottom}>
                        <i className="fa fa-arrow-circle-down fa-lg"/>
                    </span>
                </Tooltip>
            </div>
        );
    }

    _renderPresentingButton() {
        return (
            <div className="btn-group">
                <a className="btn btn-default" onClick={this.props.prevSildeshow}>
                    <i className="fa fa-chevron-circle-left fa-lg"/>
                </a>
                <a className="btn btn-default" onClick={this.props.nextSildeshow}>
                    <i className="fa fa-chevron-circle-right fa-lg"/>
                </a>
                <a className="btn btn-default" onClick={this.props.existSildeshow}>
                    <i className="fa fa-sign-out fa-lg"/>
                </a>    
            </div>
        );
    }

    render() {
        let defaultSourceButton = null,
            defaultDownloadButton = null,
            defaultPDFButton = null,
            authorSettingButton = null,
            authorAssignButton = null,
            articleEditButton = null,
            slideshowButton = null,
            presentingButton = null,
            scrollButton = null;

        if( this.props.article != null && this.props.isPresenting ) {
            presentingButton = this._renderPresentingButton.bind(this)();
        } else if (this.props.article != null) {
            defaultSourceButton = this._renderDefaultSourceButton.bind(this)();
            defaultDownloadButton = this._renderDefaultDownloadButton.bind(this)();
            defaultPDFButton = this._renderPDFDownloadButton.bind(this)();
            authorSettingButton = this._isAuthor.bind(this)() ? this._renderAuthorSettingButton.bind(this)() : null;
            authorAssignButton = this._isAuthor.bind(this)() ? this._renderAuthorAssignButton.bind(this)() : null;
            articleEditButton = this._isAllowToEdit.bind(this)() ? this._renderArticleEditButton.bind(this)() : null;
            slideshowButton = this.props.article.isSlideshow ? this._renderSlideshowButton.bind(this)() : null;
            scrollButton = this._renderScrollButton.bind(this)();
        }

        return (
            <div className="ArticleControl">
                <div className="btn-group-vertical">
                    {slideshowButton}
                    {defaultSourceButton}
                    {defaultDownloadButton}
                    {defaultPDFButton}
                </div>
                <div className="btn-group-vertical">
                    {authorSettingButton}
                    {authorAssignButton}
                    {articleEditButton}
                </div>
                {scrollButton}
                {presentingButton}
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
    return {
        articleActions: bindActionCreators(ArticleActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)


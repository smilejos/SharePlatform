"use strict";
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import screenfull from 'screenfull';
import Dropzone from'react-dropzone'
import { highlight, highlightAuto } from 'highlight.js'
import * as ArticleActions from '../../actions/ArticleActions'
import ArticleContent from '../article/ArticleContent'

class Article extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        console.log(this.props.params.articleNo);
        requestArticle(this.props.params.articleNo);
    }

    componentWillReceiveProps(nextProps) {
        console.log('receive nextProps');
        let { requestArticle, leaveArticle, cleanArticle } = this.props.actions;
        if( this.props.params.articleNo != nextProps.params.articleNo) {
            console.log('request nextProps');
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
            console.log('start fullscreen', dom);
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
        console.log(this.props.state.slide_index);
        return (
            <div>
                <ArticleButton 
                    article={this.props.state.article} 
                    Id_No={this.props.self.Id_No} 
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
            console.log('render content');
            content = this._renderContent.bind(this)();
        } else {
            console.log('render div');
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
                    <div className="Author"> {this.props.article.authorName}</div>
                    <div className="Department">{this.props.article.dept_na}</div>
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

    _renderAuthorAction() {
        return (
            <span>
                <i className="fa fa-upload fa-lg" />
                <span className="ArticleEdit" onClick={this._fileUpload.bind(this)}>Upload</span>
                <i className="fa fa-cog fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSetting/" + this.props.article.articleNo }>Setting</Link>
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleEditor/" + this.props.article.articleNo }>Edit</Link>
            </span>
        );
    }

    _renderDefaultButton() {
        return (
            <span>
                <i className="fa fa-eye fa-lg" />
                <Link className="ArticleEdit" to={ "/ArticleSource/" + this.props.article.articleNo }>Source</Link>
                <i className="fa fa-download fa-lg" />
                <a className="ArticleEdit" 
                    download={"Article_"+this.props.article.articleNo+".md"} 
                    href={"data:text/plain,"+encodeURIComponent(this.props.content)}>Download</a>
            </span>
        );
    }

    _renderSlideshowButton() {
        return (
            <span>
                <i className="fa fa-laptop fa-lg" />
                <span className="ArticleEdit" onClick={this._startSildeshow.bind(this)}>SlideShow</span>
            </span>
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
        let defaultButton, authorButton, slideshowButton, presentingButton;
        if( this.props.article != null && this.props.isPresenting ) {
            presentingButton = this._renderPresentingButton.bind(this)();
            defaultButton = null;
            authorButton = null;
            slideshowButton = null;
        } else if( this.props.article != null) {
            defaultButton = this._renderDefaultButton.bind(this)();
            authorButton = this.props.article.author == this.props.Id_No ? this._renderAuthorAction.bind(this)() : null;
            slideshowButton = this.props.article.isSlideshow ? this._renderSlideshowButton.bind(this)() : null;
            presentingButton = null;
        } else {
            defaultButton = null;
            authorButton = null;
            slideshowButton = null;
            presentingButton = null;
        }

        return (
            <div className="ArticleControl">
                { presentingButton }
                { slideshowButton }
                { defaultButton }
                { authorButton }
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


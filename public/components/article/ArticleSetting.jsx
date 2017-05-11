"use strict";
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select';
import * as ArtcileActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'

class ArticleSetting extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.articleActions;
        if (!this._isNewArticle()) {
            requestArticle(this.props.params.articleNo); 
        }
    }

    componentWillUnmount() {
        let { cleanArticle } = this.props.articleActions;
        cleanArticle();
    }

    _isNewArticle(){
        return ( this.props.params.articleNo == null);
    }

    _handleTitleChange(){
        let { updateArticle } = this.props.articleActions;
        updateArticle({ 
            title: this.refs.txtTitle.value
        }, false);
    }

    _handleRadioChange(e){
        let { updateArticle } = this.props.articleActions;
        let isPrivate = (e.target.name == "private");
        updateArticle({ 
            isPrivate: isPrivate
        }, false);
    }

    _handleSlideshowChange(e){
        let { updateArticle } = this.props.articleActions;
        updateArticle({ 
            isSlideshow: findDOMNode(e.target).checked
        }, false);
    }

    _handleCreate(){
        let { createArticle } = this.props.articleActions;
        createArticle({ 
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.article.isPrivate,
            isSlideshow: this.props.state.article.isSlideshow,
            tag: this.props.state.article.tag
        });
    }

    _handleSave(){
        let { updateArticle } = this.props.articleActions;
        updateArticle({ 
            articleNo: this.props.params.articleNo,
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.article.isPrivate,
            isSlideshow: this.props.state.article.isSlideshow,
            tag: this.props.state.article.tag
        }, true);
    }

    _handleBack() {
        let path = '/Page/Article/View/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    _handleTagChange(list) {
        let { updateArticle } = this.props.articleActions;
        let { sentClientNotice } = this.props.commonActions;
        
        if( list == null) {
            updateArticle({ 
                tag: []
            }, false);
        } else if (list.length > 3) {
            sentClientNotice({
                level : 'info',
                title : 'System Notice',
                message: 'You can not pick more than 3 tags',
                datetime: Date.now()
            });
            updateArticle({ 
                tag: []
            }, false);
        } else {
            updateArticle({ 
                tag: list.map(function(item, index){
                    return item.value;
                })
            }, false);     
        }
    }
    
    render() {
        let article = this.props.state.article;
        let options = this.props.category.map(function(item, index){
            return { value: item.name, label: item.name }
        });
        let title = this._isNewArticle() ? 'Create a New Article' : 'Manage your Article';
        let buttons;
        if(this._isNewArticle()) {
            buttons = (
                <div className="btn-group">
                    <button type="button" className="btn btn-default" onClick={this._handleCreate.bind(this)}>
                        <i className="fa fa-plus-square"/> Create
                    </button>
                </div>
            )
        } else {
            buttons = (
                <div className="btn-group">
                    <button type="button" className="btn btn-default" onClick={this._handleSave.bind(this)}>
                        <i className="fa fa-file"/> Save
                    </button>
                    <button type="button" className="btn btn-default" onClick={this._handleBack.bind(this)}>
                        <i className="fa fa-window-close"/> Cancel
                    </button>
                </div>
            );
        }

        return (
            <div className="ContentSetting">
                <div className="Section">
                    <div className="Title">{title}</div>
                    <div className="Description">A article can record program sample, environment setting and daily note.</div>
                </div>
                <div className="Section">
                    <div className="Title">Article Title</div>
                    <input type="text" ref="txtTitle" value={ article.title } onChange={this._handleTitleChange.bind(this)} />
                    <div className="Description">You can modify article title anytime.</div>
                </div>
                <div className="Section">
                    <div className="Title">Private Setting</div>
                    <div className="ItemSection">
                        <div className="Action">
                            <input type="radio" name="public" checked={!article.isPrivate} onChange={this._handleRadioChange.bind(this)} />
                        </div>
                        <div className="Image">
                            <i className="fa fa-university fa-2x" />
                        </div>
                        <div className="ItemDescription">
                            <div className="MainDescription">Public</div>
                            <div className="SubDescription">Everone can view this article.</div>
                        </div>
                    </div>
                    <div className="ItemSection">
                        <div className="Action">
                            <input type="radio" name="private" checked={article.isPrivate} onChange={this._handleRadioChange.bind(this)} />
                        </div>
                        <div className="Image">
                            <i className="fa fa-lock fa-3x" />
                        </div>
                        <div className="ItemDescription">
                            <div className="MainDescription">Private</div>
                            <div className="SubDescription">Only yourself can view this article.</div>
                        </div>
                    </div>
                    <div className="Description">You can choase article type to switch private or public.</div>
                </div>
                <div className="Section">
                    <div className="Title">Article Category or Tag</div>
                    <Select name="form-field-name"
                            value={article.tag} 
                            multi={true} 
                            options={options}
                            onChange={this._handleTagChange.bind(this)} >
                    </Select>
                    <div className="Description">You can add 3 tags at most to help people find this article.</div>
                </div>
                <div className="Section">
                    <div className="Title">Properties</div>
                    <div className="ItemSection">
                        <div className="Action">
                            <input type="checkbox" name="chkSlideShow" checked={article.isSlideshow} onChange={this._handleSlideshowChange.bind(this)} />
                        </div>
                        <div className="ItemDescription">
                            <div className="MainDescription">Material</div>
                            <div className="SubDescription">To enable this article can display as sildeshow.</div>
                        </div>
                    </div>
                </div>
                {buttons}
            </div>
        );
    }
}

class ActionButton extends React.Component {
    render() {
        return (
            <div className="ArticleControl">
                <i className="fa fa-cog fa-lg" />
                <Link className="ArticleEdit" to={ "/Page/Article/Setting/" + this.props.articleNo }>Setting</Link>
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/Page/Article/Editor/" + this.props.articleNo }>Edit</Link>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        state: state.articleReducer,
        category: state.commonReducer.category
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        articleActions: bindActionCreators(ArtcileActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch),
     }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleSetting)

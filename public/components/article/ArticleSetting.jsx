"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select';
import * as ArtcileActions from '../../actions/ArticleActions'

class ArticleSetting extends React.Component {
    constructor(props){
        super(props);
        let { requestArticle } = this.props.actions;
        if (!this._isNewArticle()) {
            requestArticle(this.props.params.articleNo); 
        }
    }

    componentWillUnmount() {
        let { cleanArticle } = this.props.actions;
        cleanArticle();
    }

    _isNewArticle(){
        return ( this.props.params.articleNo == null);
    }

    _handleTitleChange(){
        _handleUpdate(false);
    }

    _handleUpdate(isUpdateServer) {
        let { updateArticle } = this.props.actions;
        updateArticle({ 
            articleNo: this.props.params.articleNo,
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.article.isPrivate
        }, isUpdateServer);
    }

    _handleRadioChange(e){
        let { updateArticle } = this.props.actions;
        let isPrivate = (e.target.name == "private");
        updateArticle({ 
            isPrivate: isPrivate
        }, false);
    }

    _handleCreate(){
        let { createArticle } = this.props.actions;
        createArticle({ 
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.article.isPrivate
        });
    }

    _handleSave(){
        let { updateArticle } = this.props.actions;
        updateArticle({ 
            articleNo: this.props.params.articleNo,
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.article.isPrivate,
            tag: this.props.state.article.tag
        }, true);
    }

    _handleBack() {
        let path = '/Article/' + this.props.params.articleNo;
        browserHistory.push(path);
    }

    _handleTagChange(list) {
        let { updateArticle } = this.props.actions;
        updateArticle({ 
            tag: list.map(function(item, index){
                return item.value;
            })
        }, false);
    }

    render() {
        let article = this.props.state.article;
        let options = this.props.category.map(function(item, index){
            return { value: item.name, label: item.name }
        });

        let buttons;
        if(this._isNewArticle()) {
            buttons = <div>
                <button type="button" className="Button" onClick={this._handleCreate.bind(this)}>Create</button>
            </div>;
        } else {
            buttons = <div>
                <button type="button" className="Button" onClick={this._handleSave.bind(this)}>Save</button>
                <button type="button" className="Button" onClick={this._handleBack.bind(this)}>Return</button>
            </div>;
        }

        return (
            <div className="ContentSetting">
                <div className="Section">
                    <div className="Title">Create a New Article</div>
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
                    <div className="Description">You can add some tags to help people find this article.</div>
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
                <Link className="ArticleEdit" to={ "/articleSetting/" + this.props.articleNo }>Setting</Link>
                <i className="fa fa-edit fa-lg" />
                <Link className="ArticleEdit" to={ "/articleEditor/" + this.props.articleNo }>Edit</Link>
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
    return { actions: bindActionCreators(ArtcileActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleSetting)

"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as BookActions from '../../actions/BookActions'

class BookCreator extends React.Component {
    constructor(props){
        super(props);
        let { changeBookType } = this.props.actions;
        changeBookType(false);
    }

    _handleRadioChange(e){
        let { changeBookType } = this.props.actions;
        let isPrivate = (e.target.name == "private");
        changeBookType(isPrivate);
    }

    _handleCreate(){
        let { createBook } = this.props.actions;
        createBook({ 
            title: this.refs.txtTitle.value,
            isPrivate: this.props.state.book.isPrivate
        });
    }

    render() {
        let book = this.props.state.book;
        return (
            <div className="ContentSetting">
                <div className="Section">
                    <div className="Title">Create a New Book</div>
                    <div className="Description">A book can contains all the article from yours or others.</div>
                </div>
                <div className="Section">
                    <div className="Title">Book Title</div>
                    <input type="text" ref="txtTitle" />
                    <div className="Description">You can modify book title anytime.</div>
                </div>
                <div className="Section">
                    <div className="Title">Private Setting</div>
                    <div className="ItemSection">
                        <div className="Action">
                            <input type="radio" name="public" checked={!book.isPrivate} onChange={this._handleRadioChange.bind(this)} />
                        </div>
                        <div className="Image">
                            <i className="fa fa-university fa-2x" />
                        </div>
                        <div className="ItemDescription">
                            <div className="MainDescription">Public</div>
                            <div className="SubDescription">Everone can view this book.</div>
                        </div>
                    </div>
                    <div className="ItemSection">
                        <div className="Action">
                            <input type="radio" name="private" checked={book.isPrivate} onChange={this._handleRadioChange.bind(this)} />
                        </div>
                        <div className="Image">
                            <i className="fa fa-lock fa-3x" />
                        </div>
                        <div className="ItemDescription">
                            <div className="MainDescription">Private</div>
                            <div className="SubDescription">Only yourself can view this book.</div>
                        </div>
                    </div>
                    <div className="Description">You can choase book type to switch private or public.</div>
                </div>
                <button type="button" className="Button" onClick={this._handleCreate.bind(this)}>Create</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        state: state.bookReducer
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(BookActions, dispatch) }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookCreator)

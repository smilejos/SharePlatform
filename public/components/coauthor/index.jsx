import React, { Component } from 'react';
import { DropTarget, DragSource, DragDropContext } from 'react-dnd';
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import HTML5Backend, {NativeTypes} from 'react-dnd-html5-backend';
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import * as MemberActions from '../../actions/MemberActions'
import { filter, indexOf, remove } from 'lodash'
import CardsContainer from './CardsContainer'
import CardDragLayer from './CardDragLayer';

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Container extends Component {
    constructor(props) {
        super(props);
        this._calculateCandidate = this._calculateCandidate.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this.state = {
            users: [],
            candidate: []
        }

        let { requestArticle } = this.props.articleActions;
        requestArticle(this.props.params.articleNo);
    }

    componentWillMount() {
        if (this.props.members.length == 0) {
            let { getMember } = this.props.memberActions;
            getMember();
        }
    }
    
    componentWillReceiveProps(nextProps) {
        let { author, editors, members } = nextProps;
        this._calculateCandidate(author, editors, members);    
    }

    _calculateCandidate(author, editors, members) {
        let candidate = filter(members, function (user, index) {
            return indexOf(editors, user.worker_no) == -1;
        });
        let users = filter(members, function (user, index) {
            return indexOf(editors, user.worker_no) > -1;
        });
        
        remove(candidate, function (user, index) {
            return user.worker_no == author;
        });

        this.setState({
            candidate: candidate,
            users: users,
        });
    }

    _onDrop(worker_no, source, target) {
        let { assignCoEditor, removeCoEditor } = this.props.articleActions;
        let { articleNo } = this.props.params;
        if (source == target) {
            return;
        } else if (target == "editor") {
            assignCoEditor(articleNo, worker_no);
        } else if (target == "candidate") {
            removeCoEditor(articleNo, worker_no);    
        } else {
            return;
        }
    }

    render() {
        const { candidate, users } = this.state;
        const { _onDrop } = this;
        return (
            <div className="EditorAssignLayer">    
                <CardDragLayer />    
                <CardsContainer
                    users={users}
                    container={"editor"}
                    title={"Editor List"}
                    onDrop={_onDrop} />    
                <CardsContainer
                    users={candidate}
                    container={"candidate"}
                    title={"Candidate List"}
                    onDrop={_onDrop} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        author:  state.articleReducer.article.author,
        editors: state.articleReducer.article.editors,
        members: state.memberReducer.members
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        memberActions: bindActionCreators(MemberActions, dispatch),
        articleActions: bindActionCreators(ArticleActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    }
}
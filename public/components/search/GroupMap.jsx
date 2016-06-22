"use strict";
import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as ArticleActions from '../../actions/ArticleActions'
import * as CommonActions from '../../actions/CommonActions'
import * as MemberActions from '../../actions/MemberActions'
import MemberInfo from '../common/MemberInfo'
import {forEach, filter, orderBy, concat, countBy, groupBy, forIn, take} from 'lodash'

class GroupMap extends React.Component {
    constructor(props){
        super(props);
        let { requestAuthorSummary } = this.props.articleActions;
        let { getMember } = this.props.memberActions;
        requestAuthorSummary();
        getMember();
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.articles.length > 0 && nextProps.members.length > 0 && nextProps.author_counts.length == 0) {
            this._calculate(nextProps);
        }
    }

    componentWillUnmount() {
        let { clearFilterCounts } = this.props.commonActions;
        let { cleanArticles } = this.props.articleActions;
        cleanArticles();
        clearFilterCounts();
    }

     _calculate(Props) {
        let { setAuthorsCounts } = this.props.commonActions;
        let result = Props.members;
        forEach(result, function(member, index) {
            let tmp_list = [], tmp_tag = [];
            let articles = filter(Props.articles, { author: member.Id_No });
            forEach(articles, function(article){
                tmp_list = concat(tmp_list, article.tag);
            });

            forIn(countBy(tmp_list), function(value, key){
                tmp_tag.push({ 'name' : key, 'count' : value});
            });
            member.count = articles.length;
            member.tag = take(orderBy(filter(tmp_tag, function(o){
                return o.count > 0;
            }), ['count'], ['desc']), 3);
        });
        setAuthorsCounts(result);
    }

    render() {
        let list = this.props.author_counts.map(function(item, index){
            return <Member user={item} key={index} />;
        })
        return (
            <div className="MemberList">
                {list}
            </div>
        )
    }
}

class Member extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let url = 'http://cweb01/HRIS/EmployeePhoto/photo2/' +this.props.user.Id_No+ '.jpg';
        let list = this.props.user.tag.map(function(item, index){
            return <Tag item={item} key={index} />
        })
        return (
            <Link to={ "/User/" + this.props.user.Id_No } className="MemberBox">
                <div className="image">
                    <img src={url}></img>
                </div>
                <MemberInfo user={this.props.user} />
                <div className="tagInfo">
                    {list}
                </div>
            </Link>
        )
    }
}

class Tag extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        console.log(this.props.item);
        return (
            <div className="tagText">
                <span className="name"> {this.props.item.name} </span>
                <span className="count"> {this.props.item.count}</span>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { 
        members: state.memberReducer.members,
        author_counts: state.commonReducer.author_counts,
        articles: state.articleReducer.articles
    }
}

function mapDispatchToProps(dispatch) {
    return { 
        memberActions: bindActionCreators(MemberActions, dispatch),
        articleActions: bindActionCreators(ArticleActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupMap)

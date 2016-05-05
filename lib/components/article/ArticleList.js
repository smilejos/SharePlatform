"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactRouter = require('react-router');

var _ArticleActions = require('../../actions/ArticleActions');

var ArticleActions = _interopRequireWildcard(_ArticleActions);

var _redux = require('redux');

var _reactRedux = require('react-redux');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleList = (function (_React$Component) {
    _inherits(ArticleList, _React$Component);

    function ArticleList(props) {
        _classCallCheck(this, ArticleList);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ArticleList).call(this, props));
    }

    _createClass(ArticleList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var requestArticleList = this.props.actions.requestArticleList;

            var userId = this.props.userId;
            if (userId) {
                requestArticleList({
                    isSpecificUser: true,
                    Id_No: userId
                });
            } else {
                requestArticleList({
                    isSpecificUser: false
                });
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var requestArticleList = this.props.actions.requestArticleList;

            if (nextProps.userId != this.props.userId) {
                requestArticleList({
                    isSpecificUser: true,
                    Id_No: nextProps.userId
                });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'render',
        value: function render() {
            var List = null;
            if (this.props.list) {
                List = this.props.list.map(function (item, index) {
                    return _react2.default.createElement(ArticleItem, { key: item.ArticleNo, Article: item });
                });
            }
            return _react2.default.createElement(
                'div',
                { className: 'ArticleList' },
                List
            );
        }
    }]);

    return ArticleList;
})(_react2.default.Component);

var ArticleItem = (function (_React$Component2) {
    _inherits(ArticleItem, _React$Component2);

    function ArticleItem() {
        _classCallCheck(this, ArticleItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ArticleItem).apply(this, arguments));
    }

    _createClass(ArticleItem, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'ArticleActivity' },
                _react2.default.createElement(
                    _reactRouter.Link,
                    { to: "/user/" + this.props.Article.Author, className: 'ArticleAuthor' },
                    this.props.Article.AuthorName
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ArticleAction' },
                    (0, _moment2.default)(this.props.Article.UpdateTime).isSame(this.props.Article.PublishTime) ? "Publish" : "Update"
                ),
                _react2.default.createElement(
                    _reactRouter.Link,
                    { to: "/article/" + this.props.Article.ArticleNo, className: 'ArticleTitle' },
                    this.props.Article.Title
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ArticleTime' },
                    (0, _moment2.default)(this.props.Article.UpdateTime.replace("Z", "")).fromNow()
                )
            );
        }
    }]);

    return ArticleItem;
})(_react2.default.Component);

function mapStateToProps(state) {
    return { list: state.articleReducer.articles };
}

function mapDispatchToProps(dispatch) {
    return { actions: (0, _redux.bindActionCreators)(ArticleActions, dispatch) };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ArticleList);
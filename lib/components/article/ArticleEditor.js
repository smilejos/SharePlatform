"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _highlight = require('highlight.js');

var _reactNotificationSystem = require('react-notification-system');

var _reactNotificationSystem2 = _interopRequireDefault(_reactNotificationSystem);

var _ArticleActions = require('../../actions/ArticleActions');

var ArticleActions = _interopRequireWildcard(_ArticleActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Article = (function (_React$Component) {
    _inherits(Article, _React$Component);

    function Article(props) {
        _classCallCheck(this, Article);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Article).call(this, props));

        var requestArticle = _this.props.actions.requestArticle;

        if (!_this.props.state.article && _this.props.params.articleNo) {
            requestArticle(_this.props.params.articleNo);
        }
        return _this;
    }

    _createClass(Article, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._notification = this.refs.notification;
        }
    }, {
        key: '_handleUpdate',
        value: function _handleUpdate(article) {
            var editArticle = this.props.actions.editArticle;

            editArticle(article);
        }
    }, {
        key: '_handleChange',
        value: function _handleChange() {
            var temp = this.props.state.article ? this.props.state.article : {};
            temp.Content = this.refs.textarea.value;
            this._handleUpdate(temp);
        }
    }, {
        key: '_handleTitleChange',
        value: function _handleTitleChange() {
            var temp = this.props.state.article ? this.props.state.article : {};
            temp.Title = this.refs.txtTitle.value;
            this._handleUpdate(temp);
        }
    }, {
        key: '_handleKeydown',
        value: function _handleKeydown(e) {
            if (e.keyCode === 9) {
                // tab was pressed
                var val = this.refs.textarea.value,
                    start = this.refs.textarea.selectionStart,
                    end = this.refs.textarea.selectionEnd;
                this.refs.textarea.value = val.substring(0, start) + '\t' + val.substring(end);
                this.refs.textarea.selectionStart = this.refs.textarea.selectionEnd = start + 1;
                e.preventDefault();

                var temp = this.props.state.article;
                temp.Content = this.refs.textarea.value;
                this._handleUpdate(temp);
            }
        }
    }, {
        key: '_handlePostArticle',
        value: function _handlePostArticle() {
            var _props$actions = this.props.actions;
            var updateArticle = _props$actions.updateArticle;
            var publishArticle = _props$actions.publishArticle;

            var temp = this.props.state.article;
            temp.Content = this.refs.textarea.value;
            temp.Title = this.refs.txtTitle.value;

            if (this.props.params.articleNo) {
                updateArticle(temp);
            } else {
                console.log('temp', temp);
                publishArticle(temp);
            }

            this._addNotification();
        }
    }, {
        key: '_addNotification',
        value: function _addNotification() {
            this._notification.addNotification({
                message: 'Notification message',
                level: 'success',
                autoDismiss: 3,
                position: 'bl'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var Title = this.props.state.article ? this.props.state.article.Title : "";
            var Content = this.props.state.article ? this.props.state.article.Content : "";

            return _react2.default.createElement(
                'div',
                { className: 'ArticleEditor' },
                _react2.default.createElement(
                    'div',
                    { className: 'ArticleControl' },
                    _react2.default.createElement('i', { className: 'fa fa-eye fa-lg' }),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { className: 'ArticleEdit', to: "/articlePreview/" + this.props.params.articleNo },
                        'Preview'
                    )
                ),
                _react2.default.createElement('input', {
                    type: 'text',
                    ref: 'txtTitle',
                    placeholder: 'Article Title',
                    className: 'ArticleTitle',
                    value: Title,
                    onChange: this._handleTitleChange.bind(this) }),
                _react2.default.createElement('textarea', {
                    className: 'ArticleText',
                    onChange: this._handleChange.bind(this),
                    onKeyDown: this._handleKeydown.bind(this),
                    ref: 'textarea',
                    value: Content }),
                _react2.default.createElement(_reactNotificationSystem2.default, { ref: 'notification' }),
                _react2.default.createElement(
                    'button',
                    { ref: 'btn', className: 'ArticlePost', onClick: this._handlePostArticle.bind(this) },
                    'Post'
                )
            );
        }
    }]);

    return Article;
})(_react2.default.Component);

function mapStateToProps(state) {
    return { state: state.articleReducer };
}

function mapDispatchToProps(dispatch) {
    return { actions: (0, _redux.bindActionCreators)(ArticleActions, dispatch) };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Article);
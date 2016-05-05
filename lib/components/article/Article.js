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

var _ArticleActions = require('../../actions/ArticleActions');

var ArticleActions = _interopRequireWildcard(_ArticleActions);

var _ArticleContent = require('../article/ArticleContent');

var _ArticleContent2 = _interopRequireDefault(_ArticleContent);

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

        requestArticle(_this.props.params.articleNo);
        return _this;
    }

    _createClass(Article, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var leaveArticle = this.props.actions.leaveArticle;

            leaveArticle();
        }
    }, {
        key: 'render',
        value: function render() {
            var content = undefined;
            if (this.props.state.article != null) {
                content = _react2.default.createElement(_ArticleContent2.default, { article: this.props.state.article });
            } else {
                content = _react2.default.createElement('div', null);
            }
            return _react2.default.createElement(
                'div',
                { className: 'ArticleContent' },
                _react2.default.createElement(
                    'div',
                    { className: 'ArticleControl' },
                    _react2.default.createElement('i', { className: 'fa fa-edit fa-lg' }),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { className: 'ArticleEdit', to: "/articleEditor/" + this.props.params.articleNo },
                        'Edit'
                    )
                ),
                content
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
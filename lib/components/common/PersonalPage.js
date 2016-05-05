"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _ArticleActions = require('../../actions/ArticleActions');

var ArticleActions = _interopRequireWildcard(_ArticleActions);

var _ArticleList = require('../article/ArticleList');

var _ArticleList2 = _interopRequireDefault(_ArticleList);

var _PersonalInfo = require('../common/PersonalInfo');

var _PersonalInfo2 = _interopRequireDefault(_PersonalInfo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = (function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log("Personal.jsx componentDidMount");
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            console.log("Personal.jsx componentDidUpdate");
        }
    }, {
        key: '_onArticleClick',
        value: function _onArticleClick() {
            var cleanArticle = this.props.actions.cleanArticle;

            cleanArticle();
        }
    }, {
        key: '_onAuthorClick',
        value: function _onAuthorClick() {}
    }, {
        key: 'render',
        value: function render() {
            console.log(this.props.self);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'personalBox' },
                    _react2.default.createElement('div', { className: 'image' }),
                    _react2.default.createElement(_PersonalInfo2.default, { user: this.props.self }),
                    _react2.default.createElement(
                        'div',
                        { className: 'control' },
                        _react2.default.createElement(
                            'div',
                            { className: 'controlItem' },
                            _react2.default.createElement('i', { className: 'fa fa-file-text-o' }),
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: "/articleEditor" },
                                'Publish Article'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'controlItem' },
                            _react2.default.createElement('i', { className: 'fa fa-book' }),
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: "/" },
                                'Create Book'
                            )
                        )
                    )
                ),
                _react2.default.createElement(_ArticleList2.default, null)
            );
        }
    }]);

    return App;
})(_react2.default.Component);

function mapStateToProps(state) {
    return {
        self: state.memberReducer.self
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(ArticleActions, dispatch)
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);
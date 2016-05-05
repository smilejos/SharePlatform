"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _highlight2 = require('highlight.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleContent = (function (_React$Component) {
    _inherits(ArticleContent, _React$Component);

    function ArticleContent(props) {
        _classCallCheck(this, ArticleContent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ArticleContent).call(this, props));
    }

    _createClass(ArticleContent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var articleNo = this.props.article.articleNo;
        }
    }, {
        key: '_renderMarkup',
        value: function _renderMarkup(content) {
            _marked2.default.setOptions({
                renderer: new _marked2.default.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false,
                highlight: function highlight(code, lang) {
                    if (lang) {
                        return (0, _highlight2.highlight)(lang, code).value;
                    } else {
                        return (0, _highlight2.highlightAuto)(code).value;
                    }
                }
            });
            return { __html: (0, _marked2.default)(content) };
        }
    }, {
        key: '_renderTitle',
        value: function _renderTitle(title) {
            return _react2.default.createElement(
                'span',
                null,
                title
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'ArticlePage' },
                _react2.default.createElement(
                    'div',
                    { className: 'ArticleTitle' },
                    this._renderTitle(this.props.article.Title)
                ),
                _react2.default.createElement('div', { className: 'markdown-body', dangerouslySetInnerHTML: this._renderMarkup(this.props.article.Content) })
            );
        }
    }]);

    return ArticleContent;
})(_react2.default.Component);

exports.default = ArticleContent;
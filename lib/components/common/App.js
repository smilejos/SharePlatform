"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _Menu = require('../common/Menu');

var _Menu2 = _interopRequireDefault(_Menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = (function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',

        // componentWillMount() {
        //     console.log('Trace componentWillMount');
        // }

        // componentDidMount() {
        //     console.log('Trace componentDidMount');
        // }

        // componentWillReceiveProps() {
        //     console.log('Trace componentWillReceiveProps');
        // }

        // shouldComponentUpdate () {
        //     console.log('Trace shouldComponentUpdate');
        //     return true;
        // }

        // componentWillUpdate() {
        //     console.log('Trace componentWillUpdate');
        // }

        // componentDidUpdate() {
        //     console.log('Trace componentDidUpdate');
        // }

        // componentWillUnmount() {
        //     console.log('Trace componentWillUnmount');
        // }

        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_Menu2.default, null),
                _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    this.props.children
                )
            );
        }
    }]);

    return App;
})(_react2.default.Component);

exports.default = App;
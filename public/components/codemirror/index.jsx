import React, { Component, PropTypes } from 'react'
import { render, findDOMNode } from 'react-dom'
import debounce from 'lodash/debounce'
import className from 'classnames'

class CodeMirror extends Component {
    static propTypes = {
        className: React.PropTypes.any,
		codeMirrorInstance: React.PropTypes.func,
		defaultValue: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onFocusChange: React.PropTypes.func,
		onScroll: React.PropTypes.func,
		options: React.PropTypes.object,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
		preserveScrollPosition: React.PropTypes.bool
    };

    static defaultProps = {
        preserveScrollPosition: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false
        }
    }

    componentWillMount() {
        this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0);
    }

    componentDidMount() {
        let textareaNode = findDOMNode(this.refs.textarea);
		let codeMirrorInstance = this._getCodeMirrorInstance();
		this.codeMirror = codeMirrorInstance.fromTextArea(textareaNode, this.props.options);
		this.codeMirror.on('change', this._codemirrorValueChanged.bind(this));
		this.codeMirror.on('focus', this._focusChanged.bind(this, true));
		this.codeMirror.on('blur', this._focusChanged.bind(this, false));
        this.codeMirror.on('scroll', this._scrollChanged.bind(this, this.codeMirror));
        this.codeMirror.on('cursorActivity', this._cursorChanged.bind(this));
        this.codeMirror.addKeyMap(customKeymap);

        this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
        if (this.props.scrollInfo) {
            this.codeMirror.scrollTo(this.props.scrollInfo.left, this.props.scrollInfo.top);    
        }

        if (this.props.cursorInfo) {
            this.codeMirror.focus();
            this.codeMirror.getDoc().setCursor(this.props.cursorInfo);
        }

        // When we have new line, we have to append it
        if (this.props.newline && this.props.newline.length > 0 && this.props.cursorInfo) {
            this.codeMirror.replaceRange("\n" + this.props.newline, {
                line: this.props.cursorInfo.line == 0 ? this.codeMirror.lastLine() : this.props.cursorInfo.line,
                ch: this.props.cursorInfo.line == 0 ? this.codeMirror.getLineHandle(this.codeMirror.lastLine()).length : this.props.cursorInfo.ch 
            });
            this._cursorChanged(this.codeMirror);
        }
    }

    componentWillUnmount() {
        if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
    }

    componentWillReceiveProps(nextProps) {
		if (this.codeMirror && nextProps.value !== undefined && normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {
			if (this.props.preserveScrollPosition) {
				var prevScrollPosition = this.codeMirror.getScrollInfo();
				this.codeMirror.setValue(nextProps.value);
				this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
			} else {
				this.codeMirror.setValue(nextProps.value);
			}
		}
		if (typeof nextProps.options === 'object') {
			for (var optionName in nextProps.options) {
				if (nextProps.options.hasOwnProperty(optionName)) {
					this.codeMirror.setOption(optionName, nextProps.options[optionName]);
				}
			}
        }

        if (nextProps.newline && nextProps.newline.length > 0 && nextProps.cursorInfo) {
            this.codeMirror.replaceRange("\n" + nextProps.newline, {
                line: nextProps.cursorInfo.line == 0 ? this.codeMirror.lastLine() : nextProps.cursorInfo.line,
                ch: nextProps.cursorInfo.line == 0 ? this.codeMirror.getLineHandle(this.codeMirror.lastLine()).length : nextProps.cursorInfo.ch 
            });
            this._cursorChanged(this.codeMirror);
        }

    }

    _getCodeMirror() {
		return this.codeMirror;
    }

    _cursorChanged(CodeMirror) {
        let cursor = CodeMirror.getCursor(); // gets the line number in the cursor position
        this.props.onCursorChanged(cursor);
    }
    
    _getCodeMirrorInstance() {
		return this.props.codeMirrorInstance || require('codemirror');
	}
    
    _focus (){
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
    }
    
    _focusChanged(focused) {
        this.setState({
            isFocused: focused
        });
        this.props.onFocusChange && this.props.onFocusChange(focused);
    }
    
	_scrollChanged(CodeMirror) {
		this.props.onScroll && this.props.onScroll(CodeMirror.getScrollInfo());
    }
    
    _codemirrorValueChanged(doc, change) {
		if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change);
		}
    }
    
    render() {
        var editorClassName = className('ReactCodeMirror', this.state.isFocused ? 'ReactCodeMirror--focused' : null);
        return (
            <div className={this.props.className}>
                <textarea ref={'textarea'} className={editorClassName} name={this.props.path} defaultValue={this.props.value}  autoComplete={'off'} />
            </div>
        )
    }
}

const normalizeLineEndings = str => {
    if (!str)
        return str;
    else 
        return str.replace(/\r\n|\r/g, '\n');
}

function queryCaseInsensitive(query) {
    return typeof query == "string" && query == query.toLowerCase();
}

function getSearchCursor(cm, query, pos) {
// Heuristic: if the query string is all lowercase, do a case insensitive search.
    return cm.getSearchCursor(query, pos, queryCaseInsensitive(query));
}

// We add this pupular function in Sublime.
const customKeymap = {
    "Alt-Enter": function (cm) {  
        let query = cm.getSelection() || getSearchState(cm).lastQuery;
        let lineRanges = [];
        for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
            lineRanges.push({
                anchor: cursor.from(),
                head: cursor.to()
            });
        }
        cm.setSelections(lineRanges, 0);
    }
};


module.exports = CodeMirror;
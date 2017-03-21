"use strict";
import React from 'react'
import { render } from 'react-dom'
// import marked from 'marked'
import Remarkable from 'remarkable'
import hljs from 'highlight.js'

export default class ArticleContent extends React.Component {
    constructor(props){
        super(props);
    }

    _renderMarkdown(content) {
        var md = new Remarkable('full', {
            html:         true,        // Enable HTML tags in source
            xhtmlOut:     false,        // Use '/' to close single tags (<br />)
            breaks:       true,        // Convert '\n' in paragraphs into <br>
            langPrefix:   'language-',  // CSS language prefix for fenced blocks
            linkify:      false,        // Autoconvert URL-like text to links

            // Enable some language-neutral replacement + quotes beautification
            typographer:  true,

            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
            quotes: '“”‘’',

            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        let result = hljs.highlight(lang, str).value;
                        return result;
                    } catch (err) {
                        console.log('highlight parsing error');
                    }
                } else if (lang == "mermaid") {
                    return '<div class="mermaid">' + mermaid.mermaidAPI.render(str) + '</div>';
                } else if (lang == "sequence") {
                    let diagram = Diagram.parse(str);
                    let node = document.createElement("div");
                    diagram.drawSVG(node, { theme: 'hand' });
                    //console.log(str, node, diagram);
                    return '<div class="sequence-diagram">' + node.innerHTML + '</div>';
                } else if (lang == "flowchart") {
                    let diagram = flowchart.parse(str);
                    let node = document.createElement("div");
                    diagram.drawSVG(node);
                    return '<div class="flowchart">' + node.innerHTML + '</div>';
                }

                try {
                    //console.log('auto hljs');
                    return hljs.highlightAuto(str).value;
                } catch (err) {
                    console.log('highlight parsing error');
                }

                return ''; // use external default escaping
            }
        });

        return md.render(content);
    }

    _renderCheckBox(content) {
        // [x] -> <input type="checkbox" checked disabled />
        if (/\[[x|\s]\]/g.test(content)) {
            content = content.replace(/\[\s\]/g, '<input type="checkbox" disabled />');
            content = content.replace(/\[x\]/g, '<input type="checkbox" checked disabled />');
        }
        return content;
    }

    _renderIcon(content) {
        // (i)[fa-user] -> <i class="fa fa-user"></i>
        if (/\(i\)\[(.*)\]/g.test(content)) {
            content = content.replace(/\(i\)\[(.*)\]/g, '<i class="fa $1"></i>');
        }
        return content;
    }

    render() {
        let content = this.props.content;
        content = this._renderMarkdown(content);
        content = this._renderCheckBox(content);
        content = this._renderIcon(content);

        //console.log(content);
        return (
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }} /> 
        );
    }
}

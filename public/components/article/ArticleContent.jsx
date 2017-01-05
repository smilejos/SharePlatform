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

    _renderMarkup(content) {
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
                    console.log('in hljs');
                    try {
                        let result = hljs.highlight(lang, str).value;
                        //let array = result.split('\n');
                        console.log(result, array);
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

        return { __html: md.render(content) };
    }

    render() {
        
        return (
            <div className="markdown-body" dangerouslySetInnerHTML={ this._renderMarkup(this.props.content) } /> 
        );
    }
}

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
        // marked.setOptions({
        //     renderer: new marked.Renderer(),
        //     gfm: true,
        //     tables: true,
        //     breaks: true,
        //     pedantic: true,
        //     sanitize: false,
        //     smartLists: true,
        //     smartypants: true,
        //     highlight: function (code, lang) {
        //         if(lang) {
        //             return highlight(lang, code).value;    
        //         } else {
        //             return highlightAuto(code).value;    
        //         }
        //     }
        // });
        // return { __html: marked(content)};
        console.log('use remark to parsing');
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
                        return hljs.highlight(lang, str).value;
                    } catch (err) {
                        console.log('highlight parsing error');
                    }
                }

                try {
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

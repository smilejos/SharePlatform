let fs = require("fs"),
    is = require('is_js'),
    rimraf = require("rimraf"),
    markdownpdf = require("markdown-pdf"),
    hljs = require("highlight.js"),
    ArticleHandler = require('../database/articleHandler'),
    options = {
        highlightCssPath: "./node_modules/highlight.js/styles/xcode.css",
        cssPath: "./assets/markdown.css",
        //cssPath: "highlight.js/styles/xcode.css",
        //cssPath: "../../highlight.js/styles/xcode.css",
        remarkable: {
            html: true,        // Enable HTML tags in source
            xhtmlOut: false,        // Use '/' to close single tags (<br />)
            breaks: true,        // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',  // CSS language prefix for fenced blocks
            linkify: false,        // Autoconvert URL-like text to links
            typographer: true,
            quotes: '“”‘’'
        }
    };

module.exports = function(req, res) {
    let articleNo = req.params.articleNo;
    let filename = articleNo + '.pdf';
    let filepath = 'temp\\' + filename;

    ArticleHandler.getSpecificArticle(articleNo, function (article) {
        article = is.array(article) ? article[0] : article;
        //markdownpdf(options).from.string(article.content).to(filepath);
        
        // console.log(article.content);
        markdownpdf(options).from.string(article.content).to(filepath, function () { 
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', 'application/pdf');
            var filestream = fs.createReadStream(filepath);
            filestream.pipe(res);
        });
    });
}

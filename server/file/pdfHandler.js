let fs = require("fs"),
    is = require('is_js'),
    rimraf = require("rimraf"),
    split = require("split"),
    through = require("through"),
    duplexer = require("duplexer"),
    markdownpdf = require("markdown-pdf"),
    hljs = require("highlight.js"),
    ArticleHandler = require('../database/articleHandler'),
    options = {
        preProcessMd: preProcessMd,
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
    ArticleHandler.getSpecificArticle(articleNo, function (article) {
        article = is.array(article) ? article[0] : article;
        let filename = article.title + '.pdf';
        let filepath = 'temp\\' + filename;
        //markdownpdf(options).from.string(article.content).to(filepath);
        
        markdownpdf(options).from.string(article.content).to(filepath, function () { 
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', 'application/pdf');
            var filestream = fs.createReadStream(filepath);
            filestream.pipe(res);
        });
    });
}

function preProcessMd() {
    // Split the input stream by lines
    let splitter = split()
    let regex = /(!\[\])\(\/(\d+)\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\/(.+)\)/;
    // Replace occurences of "foo" with "bar"
    
    var replacer = through(function (data) {
        if (data.match(regex)) {
            let serverName = "http://vtd003";
            let [,,articleNo, uuid, filename] = data.match(regex) || [];
            this.queue(data.replace(regex, `![](${serverName}/${articleNo}/${uuid}/${filename})`) + "\n");
        } else { 
            this.queue(data + "\n");
        }
    })

    splitter.pipe(replacer)
    return duplexer(splitter, replacer)
}

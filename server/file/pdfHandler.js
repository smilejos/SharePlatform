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
        preProcessHtml: preProcessHtml,
        highlightCssPath: "./node_modules/highlight.js/styles/xcode.css",
        //highlightCssPath: "./bower_components/font-awesome/css/font-awesome.css",
        cssPath: "./assets/markdown.css",
        //cssPath: "./assets/style.css",
        //cssPath: "highlight.js/styles/xcode.css",
        //cssPath: "../../highlight.js/styles/xcode.css",
        remarkable: {
            preset: 'full',
            html: true,        // Enable HTML tags in source
            xhtmlOut: false,        // Use '/' to close single tags (<br />)
            breaks: true,        // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',  // CSS language prefix for fenced blocks
            linkify: false,        // Autoconvert URL-like text to links
            typographer: true,
            quotes: '“”‘’'
        }
    };

module.exports = function (req, res) {
    let articleNo = req.params.articleNo;
    ArticleHandler.getSpecificArticle(articleNo, function (article) {
        article = is.array(article) ? article[0] : article;
        let filename = article.title.replace(/,/g, "_").replace(/;/g, "_") + '.pdf';
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
    let splitter = split();
    let replacer = through(function (line) {
        line = replaceImage(line);
        this.queue(line + "\n");
    });

    splitter.pipe(replacer);
    return duplexer(splitter, replacer);
}

function preProcessHtml() {
    // Split the input stream by lines
    let splitter = split();
    let replacer = through(function (line) {
        line = replaceCheckbox(line);
        line = replaceIcon(line);
        this.queue(line + "\n");
    });

    splitter.pipe(replacer);
    return duplexer(splitter, replacer);
}

function replaceImage(line) {
    let regex = /(!\[\])\(\/(\d+)\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\/(.+)\)/;
     console.log('before enter image', line);
    if (regex.test(line)) {
        console.log('enter image', line);
        let serverName = "http://vtd003";
        let [, , articleNo, uuid, filename] = line.match(regex) || [];
        line = line.replace(regex, `![](${serverName}/${articleNo}/${uuid}/${filename})`);
    }
    return line;
}

function replaceCheckbox(line) {
    let regex = /\[[x|\s]\]/g;
    if (regex.test(line)) {
        console.log('enter checkbox', line);
        line = line.replace(/\[\s\]/g, '<input type="checkbox" />');
        line = line.replace(/\[x\]/g, '<input type="checkbox" checked />');
    }
    return line;
}

function replaceIcon(line) {
    let regex = /\(i\)\[([\w|-]*)\]/g;
    if (regex.test(line)) {
        console.log('enter icon', line);
        line = line.replace(regex, '<i class="fa $1"></i>')
    }
    return line;
}
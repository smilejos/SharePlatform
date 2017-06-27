let sql = require('mssql'),
    config = require('../config/database'),
    lodash  = require('lodash');

/**
 * @param  {} worker_no - Micron Woker Number
 * @param  {} callback
 */
function getTagSummary(worker_no, callback){
    let sqlString = ` select tag from dbo.Article (nolock)
                      where (isPrivate = 0 or Author = '${worker_no}') and tag != ''`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} worker_no - Micron Woker Number
 * @param  {} callback
 */
function getAuthorSummary(worker_no, callback) {
    let sqlString = ` select author, tag from dbo.Article (nolock)
                      where (isPrivate = 0 or Author = '${worker_no}')`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} worker_no - Micron Woker Number
 * @param  {} callback
 */
function getArticlesByAuthor(worker_no, callback) {
    let sqlString = ` select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate
                      from dbo.Article a (nolock)
                      left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id
                      where isPrivate = 0 and Author = '${worker_no}' order by UpdateTime DESC`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} worker_no - Micron Woker Number
 * @param  {} callback
 */
function getArticlesBySelf(worker_no, callback){
    let sqlString = ` select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate
                      from dbo.Article a (nolock)
                      left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id
                      where Author = '${worker_no}' order by UpdateTime DESC`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} tag - put one tag that you want to search
 * @param  {} worker_no - Micron Woker Number
 * @param  {} callback
 */
function getArticlesByTag(tag, worker_no, callback){
    let sqlString = ` select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate
                      from dbo.Article a (nolock)
                      left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id
                      where (isPrivate = 0 or Author = '${worker_no}')
                      and tag like '%${tag}%'
                      order by UpdateTime DESC `;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} options {
 *      @param search key word in title and content
 *      @param isPrivate: true or false
 * }
 * @param  {} callback
 */
function getSearchArticles(options, callback){
    let sqlString = ` select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate
                      from dbo.Article a (nolock)
                      left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id
                      where 1 = 1 `;

    if( options.keyword &&  options.keyword.length > 0) {
        let sqlSubString = '';
        lodash.forEach(options.keyword, function(item, index){
            if(sqlSubString.length == 0) {
                sqlSubString += `( title like '%${item}%' or content like '%${item}%' )`;
            } else {
                sqlSubString += `or ( title like '%${item}%' or content like '%${item}"%' )`;
            }
        });

        sqlString += ` and (${sqlSubString})`;
    }

    if( options.isPrivate ) {
        sqlString += ` and author = '${options.worker_no}'`;
    } else {
        sqlString += " and isPrivate = 0 ";
    }

    sqlString += " order by UpdateTime DESC ";
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo - article number
 * @param  {} callback
 */
function getSpecificArticle(articleNo, callback){
    let sqlString = ` select articleNo, title, author, editor, tag, updateTime, publishTime, content, isPrivate, isBookArticle, isSlideshow
                      from dbo.Article (nolock)
                      where ArticleNo = '${articleNo}'`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} article {
 *      @param content - markdown content
 *      @param editor
 *      @param articleNo - article number
 * }
 * @param  {} callback
 */
function modifyArticle(article, callback){
    let sqlString = ` update dbo.Article set 
                      content = '${_replaceString(article.content)}', 
                      editor = '${article.editor}', 
                      UpdateTime = getDate() where ArticleNo = '${article.articleNo}' `;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} article {
 *      @param title
 *      @param editor
 *      @param tag
 *      @param isPrivate
 *      @param isSlideshow
 *      @param articleNo
 * }
 * @param  {} callback
 */
function updateArticle(article, callback){
    let sqlString = ` update dbo.Article set 
                      title = '${_replaceString(article.title)}', 
                      Tag = '${article.tag}',
                      isPrivate = '${article.isPrivate}', 
                      isSlideshow = '${article.isSlideshow}',
                      UpdateTime = getDate()
                      where ArticleNo = '${article.articleNo}'`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} article {
 *      @param title
 *      @param author
 *      @param tag
 *      @param isPrivate
 *      @param isSlideshow
 * }
 * @param  {} callback
 */
function createArticle(article, callback){
    let sqlString = ` insert into  dbo.Article (title, Author, editor, content, Tag, UpdateTime, PublishTime, isPrivate, isSlideshow)
                      values ('${article.title}','${article.author}','${article.author}','','${article.tag}', getDate(), getDate(), '${article.isPrivate}', '${article.isSlideshow}')`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} callback
 */
function getArticleImages(articleNo, callback){
    let sqlString = ` select articleNo, UID, fileName, fileSize, dtime, CONVERT(INT, ROW_NUMBER() OVER (ORDER BY dtime) - 1) as id
                      from dbo.Image (nolock) where articleNo = '${articleNo}'
                      order by dtime `;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} UID
 * @param  {} fileName
 * @param  {} fileSize
 * @param  {} callback
 */
function uploadImage(articleNo, UID, fileName, fileSize, callback) {
    let sqlString = ` insert into  dbo.Image (ArticleNo, UID, FileName, FileSize, dtime)
                      values ('${articleNo}','${UID}','${fileName}',${fileSize}, getDate())`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} UID
 * @param  {} callback
 */
function deleteImageByUID(UID, callback) {
    let sqlString = ` delete from dbo.Image where UID = '${UID}'`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} callback
 */
function getCollaboratedEditors(articleNo, callback) {
    let sqlString = ` select editor from dbo.CoEditor (nolock) where ArticleNo = '${articleNo}' `;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} editor - Micron worker number
 * @param  {} callback
 */
function assignCollaboratedEditor(articleNo, editor, callback) {
    let sqlString = ` insert into dbo.CoEditor (ArticleNo, Editor, AssignTime)
                      values ('${articleNo}','${editor}',getDate())`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} editor - Micron worker number
 * @param  {} callback
 */
function deleteCollaboratedEditor(articleNo, editor, callback) {
    let sqlString = ` delete from dbo.CoEditor where ArticleNo = '${articleNo}' and editor = '${editor}' `;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} articleNo
 * @param  {} callback
 */
function deleteImageByArticle(articleNo, callback) {
    let sqlString = ` delete from dbo.Image where articleNo = '${articleNo}'`;
    _executeSqlComment(sqlString, callback);
}

/**
 * @param  {} sqlComment
 * @param  {} callback
 */
function _executeSqlComment(sqlComment, callback) {
    let connection = new sql.Connection(config, (err) => {
        let request = connection.request();
        request.query(sqlComment, (err, recordset) => {
            if( err ) {
                console.log('Sql Exception ', err);
                console.log('Sql Exception ', sqlComment);
            } else {
                callback(recordset, err);
                recordset = null;
            }
        });
    });
}

function _replaceString(content) {
    let regex = /'/gi;
    return content.replace(regex, "''");
}

module.exports = {
    getArticlesBySelf: getArticlesBySelf,
    getArticlesByAuthor: getArticlesByAuthor,
    getArticlesByTag: getArticlesByTag,
    getSearchArticles: getSearchArticles,
    getSpecificArticle: getSpecificArticle,
    getTagSummary: getTagSummary,
    getAuthorSummary: getAuthorSummary,
    modifyArticle : modifyArticle ,
    updateArticle : updateArticle ,
    createArticle : createArticle ,
    getArticleImages: getArticleImages,
    uploadImage: uploadImage,
    deleteImageByUID: deleteImageByUID,
    deleteImageByArticle: deleteImageByArticle,
    getCollaboratedEditors: getCollaboratedEditors,
    deleteCollaboratedEditor: deleteCollaboratedEditor,
    assignCollaboratedEditor: assignCollaboratedEditor
};

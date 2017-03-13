"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = require('../config/database'),
		lodash  = require('lodash');

	function _getNewestArticle(worker_no, callback){
		let sqlString = " select top 10 articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate " +
                        " from dbo.Article a (nolock) " +
                        " left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id " +
						" where (isPrivate = 0 or Author = '" + worker_no + "')" +
						" order by UpdateTime DESC ";
        
		_executeSqlComment(sqlString, callback);
	}

	function _getTagSummary(worker_no, callback){
		let sqlString = " select tag from dbo.Article (nolock) " +
						" where (isPrivate = 0 or Author = '" + worker_no + "') and tag != ''";
		_executeSqlComment(sqlString, callback);
	}

	function _getAuthorSummary(worker_no, callback){
		let sqlString = " select author, tag from dbo.Article (nolock) " +
						" where (isPrivate = 0 or Author = '" + worker_no + "')";
		_executeSqlComment(sqlString, callback);
	}

    function _getArticlesBySelf(worker_no, callback) {
        let sqlString = " select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate " +
				        " from dbo.Article a (nolock) " +
                        " left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id " +
                        " where isPrivate = 0 and Author = '" + worker_no + "' order by UpdateTime DESC";
        
        _executeSqlComment(sqlString, callback);
    }
	function _getArticlesByAuthor(worker_no, callback){
		let sqlString = " select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate " +
                        " from dbo.Article a (nolock) " +
                        " left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id " +  
                        " where Author = '" + worker_no + "' order by UpdateTime DESC";
        
		_executeSqlComment(sqlString, callback);
	}

	function _getArticlesByTag(Tag, worker_no, callback){
		let sqlString = " select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate " +
						" from dbo.Article a (nolock) " +
                        " left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id " +
						" where (isPrivate = 0 or Author = '" + worker_no + "')" +
						" and tag like '%" + Tag + "%'" +
						" order by UpdateTime DESC ";
		_executeSqlComment(sqlString, callback);
	}

	function _getSearchArticles(options, callback){
		let sqlString = " select articleNo, title, author, card_na, tag, updateTime, publishTime, isSlideshow, isPrivate " +
						" from dbo.Article a (nolock) " +
                        " left join HRIS.dbo.SAP_Nemployee b (nolock)  on a.author = b.Emp_id " +
						" where 1 = 1 ";
		
		if( options.keyword &&  options.keyword.length > 0) {
			let sqlSubString = '';
			lodash.forEach(options.keyword, function(item, index){
				if(sqlSubString.length == 0) {
					sqlSubString += " ( title like '%" + item + "%' or content like '%" + item + "%' )";
				} else {
					sqlSubString += " or ( title like '%" + item + "%' or content like '%" + item + "%' )";
				}			    
	    	});
	    	
			sqlString += " and ("+ sqlSubString+")";
		}

		if( options.isPrivate ) {
			sqlString += " and author = '" + options.worker_no + "'";
		} else {
			sqlString += " and isPrivate = 0 ";
		}

        sqlString += " order by UpdateTime DESC ";
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificArticle(articleNo, callback){
		let sqlString = " select articleNo, title, author, tag, updateTime, publishTime, content, isPrivate, isBookArticle, isSlideshow " +
						" from dbo.Article (nolock) " + 
						" where ArticleNo = '" + articleNo + "'";

		_executeSqlComment(sqlString, callback);
	}

	/// Modify Article Content
	function _modifyArticle(article, callback){
		let sqlString = " update dbo.Article set content = '" +article.content+ "', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	/// Update Article Attribute (Tag, Title, Private)
	function _updateArticle(article, callback){
		let sqlString = " update dbo.Article set title = '"+ article.title +"', Tag = '" +article.tag+ "', isPrivate = '"+article.isPrivate+"', isSlideshow = '"+article.isSlideshow+"', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	function _createArticle(article, callback){
		let sqlString = " insert into  dbo.Article (title, Author, content, Tag, UpdateTime, PublishTime, isPrivate, isSlideshow) "+
		                " values ('" +article.title +"','"+ article.author +"','','"+ article.tag +"', getDate(), getDate(), '"+article.isPrivate+"', '"+article.isSlideshow+"')";
		_executeSqlComment(sqlString, callback);
    }
    
    function _getArticleImages(articleNo, callback){
		let sqlString = " select articleNo, UID, fileName, fileSize, dtime, CONVERT(INT, ROW_NUMBER() OVER (ORDER BY dtime) - 1) as id " +
						" from dbo.Image (nolock) where articleNo = '" + articleNo + "'" +
                        " order by dtime ";

		_executeSqlComment(sqlString, callback);
    }
    
    function _uploadImage(articleNo, UID, fileName, fileSize, callback) {
        let sqlString = " insert into  dbo.Image (ArticleNo, UID, FileName, FileSize, dtime) " +
            " values ('" + articleNo + "','" + UID + "','" + fileName + "'," + fileSize + ", getDate())";
		_executeSqlComment(sqlString, callback);
    }

    function _deleteImageByUID(UID, callback) {
        let sqlString = " delete from dbo.Image where UID = '" + UID + "'";
		_executeSqlComment(sqlString, callback);
    }

    function _deleteImageByArticle(articleNo, callback) {
        let sqlString = " delete from dbo.Image where articleNo = '" + articleNo + "'";
		_executeSqlComment(sqlString, callback);
    }

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
	
	return {
		getNewestArticle: function(worker_no, callback){
			_getNewestArticle(worker_no, callback);
        },
        getArticlesBySelf: function(worker_no, callback){
			_getArticlesBySelf(worker_no, callback);
		},
		getArticlesByAuthor: function(worker_no, callback){
			_getArticlesByAuthor(worker_no, callback);
		},
		getArticlesByTag: function(Tag, worker_no, callback){
			_getArticlesByTag(Tag, worker_no, callback);
		},
		getSearchArticles: function(options, callback){
			_getSearchArticles(options, callback);
		},
		getSpecificArticle: function(articleNo, callback){
			_getSpecificArticle(articleNo, callback);
		},
		getTagSummary: function(worker_no, callback){
			_getTagSummary(worker_no, callback);
		},
		getAuthorSummary: function(worker_no, callback){
			_getAuthorSummary(worker_no, callback);
		},
		modifyArticle : function(article, callback){
			article.content = _replaceString(article.content);
			_modifyArticle(article, callback);
		},
		updateArticle : function(article, callback){
			article.title = _replaceString(article.title);
			_updateArticle(article, callback);
		},
		createArticle : function(article, callback){
			article.title = _replaceString(article.title);
			_createArticle(article, callback);
        },
        getArticleImages: function (articleNo, callback) {
            _getArticleImages(articleNo, callback);
        },
        uploadImage: function (articleNo, UID, fileName, fileSize, callback) {
            _uploadImage(articleNo, UID, fileName, fileSize, callback);
        },
        deleteImageByUID: function (UID, callback) {
            _deleteImageByUID(UID, callback);
        },
        deleteImageByArticle: function (articleNo, callback) { 
            _deleteImageByArticle(articleNo, callback);
        }
	}
} ();

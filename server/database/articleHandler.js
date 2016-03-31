"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = {
		    user: 'admBlog',
		    password: 'zzzzzzzz',
		    server: 'TSQL00',
		    database: 'JustBlog'
		};

	function _getNewestArticle(callback){
		let sqlString = " select top 20 ArticleNo, Title, Author, Tag, Dtime from dbo.Article " + 
						" order by Dtime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificAuthor(Id_No, callback){
		let sqlString = " select ArticleNo, Title, Author, Tag, Dtime from dbo.Article " + 
						" where Author = '" + Id_No + "' order by Dtime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificTag(Tag, callback){
		let sqlString = " select ArticleNo, Title, Author, Tag, Dtime from dbo.Article " +
						" where Tag = '" + Tag + "' order by Dtime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificArticle(ArticleNo, callback){
		let sqlString = " select ArticleNo, Title, Author, Content, Tag, Dtime " +
						" from dbo.Article where ArticleNo = '" + ArticleNo + "'";

		_executeSqlComment(sqlString, callback);
	}

	function _modifyArticle(Article, callback){
		let sqlString = " update dbo.Article set Title = '"+ Article.Title +"', Content = '" +Article.Content+ "', Tag = '" +Article.Tag+ "', Dtime = getDate() where ArticleNo = '" + Article.ArticleNo + "'";
		
		_executeSqlComment(sqlString, callback);
	}

	function _publishArticle(Article, callback){
		let sqlString = " insert into  dbo.Article (Title, Author, Content, Tag, Dtime) "+
		                " values ('" +Article.Title +"','"+ Article.Author +"','"+ Article.Content +"','"+ Article.Tag +"', getDate())";
		
		_executeSqlComment(sqlString, callback);
	}

	function _executeSqlComment(sqlComment, callback) {
		sql.connect(config, (err) => {
			let request = new sql.Request();
	    	request.query(sqlString, (err, recordset) => {
	    		callback(recordset[0]);
	    	});
		});
	}

	function _replaceString(content) {
		let regex = /'/gi;
		return content.replace(regex, "''");
	}

	return {
		getNewestArticle: function(callback){
			_getNewestArticle(callback);
		},
		getSpecificAuthor: function(Id_No, callback){
			_getSpecificAuthor(Id_No, callback);
		},
		getSpecificTag : function(Tag, callback){
			_getSpecificTag(Tag, callback);
		},
		getSpecificArticle : function(ArticleNo, callback){
			_getSpecificArticle(ArticleNo, callback);
		},
		modifyArticle : function(Article, callback){
			Article.Title = _replaceString(Article.Title);
			Article.Content = _replaceString(Article.Content);
			_modifyArticle(Article, callback);
		},
		publishArticle : function(Article, callback){
			Article.Title = _replaceString(Article.Title);
			Article.Content = _replaceString(Article.Content);
			_publishArticle(Article, callback);
		}
	}
}();
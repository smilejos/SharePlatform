"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = require('../config/database');

	function _getNewestArticle(callback){
		let sqlString = " select top 10 a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" order by a.UpdateTime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificAuthor(Id_No, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where Author = '" + Id_No + "'" +
						" order by a.UpdateTime DESC ";

		_executeSqlComment(sqlString, callback);
	}

	function _getSearchArticles(options, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where isPrivate = 0 ";
		
		if( options.keyword != '' ) {
			sqlString += " and ( a.title like '%" + options.keyword + "%' or a.content like '%" + options.keyword + "%' )";
		}

		if( options.isPrivate ) {
			sqlString += " and a.author = '" + options.author + "'";
		}

		sqlString += " order by a.UpdateTime DESC ";
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificArticle(articleNo, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.content, a.isPrivate, a.isBookArticle " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where ArticleNo = '" + articleNo + "'" +
						" order by a.UpdateTime DESC ";

		_executeSqlComment(sqlString, callback);
	}

	/// Modify Article Content
	function _modifyArticle(article, callback){
		let sqlString = " update dbo.Article set content = '" +article.content+ "', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	/// Update Article Attribute (Tag, Title, Private)
	function _updateArticle(article, callback){
		let sqlString = " update dbo.Article set title = '"+ article.title +"', Tag = '" +article.tag+ "', isPrivate = '"+article.isPrivate+"', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	function _createArticle(article, callback){
		let sqlString = " insert into  dbo.Article (title, Author, content, Tag, UpdateTime, PublishTime, isPrivate) "+
		                " values ('" +article.title +"','"+ article.author +"','','"+ article.tag +"', getDate(), getDate(), '"+article.isPrivate+"')";
		
		console.log('sql command', sqlString);
		_executeSqlComment(sqlString, callback);
	}

	function _executeSqlComment(sqlComment, callback) {
		sql.connect(config, (err) => {
			let request = new sql.Request();
	    	request.query(sqlComment, (err, recordset) => {
	    		callback(recordset, err);
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
		getSearchArticles : function(options, callback){
			_getSearchArticles(options, callback);
		},
		getSpecificArticle : function(articleNo, callback){
			_getSpecificArticle(articleNo, callback);
		},
		modifyArticle : function(article, callback){
			article.content = _replaceString(article.content);
			_modifyArticle(article, callback);
		},
		updateArticle : function(article, callback){
			article.title = _replaceString(article.title);
			console.log('db event', article);
			_updateArticle(article, callback);
		},
		createArticle : function(article, callback){
			article.title = _replaceString(article.title);
			_createArticle(article, callback);
		}
	}
}();
"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = require('../config/database'),
		lodash  = require('lodash');

	function _getNewestArticle(self_user, callback){
		let sqlString = " select top 10 a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.isSlideshow, a.isPrivate " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where (isPrivate = 0 or a.Author = '" + self_user + "')" +
						" order by a.UpdateTime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getTagSummary(self_user, callback){
		let sqlString = " select tag from dbo.Article (nolock) " +
						" where (isPrivate = 0 or Author = '" + self_user + "') and tag != ''";
		_executeSqlComment(sqlString, callback);
	}

	function _getAuthorSummary(self_user, callback){
		let sqlString = " select author, tag from dbo.Article (nolock) " +
						" where (isPrivate = 0 or Author = '" + self_user + "')";
		_executeSqlComment(sqlString, callback);
	}

	function _getArticlesByAuthor(Id_No, self_user, callback){
		let subSqlString = "";
		if( self_user == Id_No ) {
			subSqlString =  " and Author = '" + Id_No + "'";
			subSqlString += " order by a.UpdateTime DESC ";
		} else {
			subSqlString = " and isPrivate = 0 and Author = '" + Id_No + "'";
			subSqlString += " order by a.UpdateTime DESC ";
		}

		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.isSlideshow, a.isPrivate " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where 1 = 1 ";

		_executeSqlComment(sqlString + subSqlString, callback);
	}

	function _getArticlesByTag(Tag, self_user, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.isSlideshow, a.isPrivate " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where (isPrivate = 0 or Author = '" + self_user + "')" +
						" and tag like '%" + Tag + "%'" +
						" order by a.UpdateTime DESC ";
		_executeSqlComment(sqlString, callback);
	}

	function _getSearchArticles(options, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.isSlideshow, a.isPrivate " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where 1 = 1 ";
		
		if( options.keyword &&  options.keyword.length > 0) {
			let sqlSubString = '';
			lodash.forEach(options.keyword, function(item, index){
				if(sqlSubString.length == 0) {
					sqlSubString += " ( a.title like '%" + item + "%' or a.content like '%" + item + "%' )";
				} else {
					sqlSubString += " or ( a.title like '%" + item + "%' or a.content like '%" + item + "%' )";
				}			    
	    	});
	    	
			sqlString += " and ("+ sqlSubString+")";
		}

		if( options.isPrivate ) {
			sqlString += " and a.author = '" + options.author + "'";
		} else {
			sqlString += " and a.isPrivate = 0 ";
		}

		sqlString += " order by a.UpdateTime DESC ";
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificArticle(articleNo, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, c.EDept_Na1 as dept_na, a.author, a.tag, a.updateTime, a.publishTime, a.content, a.isPrivate, a.isBookArticle, a.isSlideshow " +
						" from dbo.Article a (nolock) " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" left join HRIS.dbo.NSection c on b.Dept_no = c.Dept_no" +
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
		let sqlString = " update dbo.Article set title = '"+ article.title +"', Tag = '" +article.tag+ "', isPrivate = '"+article.isPrivate+"', isSlideshow = '"+article.isSlideshow+"', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	function _createArticle(article, callback){
		let sqlString = " insert into  dbo.Article (title, Author, content, Tag, UpdateTime, PublishTime, isPrivate, isSlideshow) "+
		                " values ('" +article.title +"','"+ article.author +"','','"+ article.tag +"', getDate(), getDate(), '"+article.isPrivate+"', '"+article.isSlideshow+"')";
		_executeSqlComment(sqlString, callback);
	}

	function _executeSqlComment(sqlComment, callback) {
		sql.connect(config, (err) => {
			let request = new sql.Request();
	    	request.query(sqlComment, (err, recordset) => {
	    		if( err ) {
	    			console.log('Sql Exception', sqlComment);
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
		getNewestArticle: function(self_user, callback){
			_getNewestArticle(self_user, callback);
		},
		getArticlesByAuthor: function(Id_No, self_user, callback){
			_getArticlesByAuthor(Id_No, self_user, callback);
		},
		getArticlesByTag: function(Tag, self_user, callback){
			_getArticlesByTag(Tag, self_user, callback);
		},
		getSearchArticles: function(options, callback){
			_getSearchArticles(options, callback);
		},
		getSpecificArticle: function(articleNo, callback){
			_getSpecificArticle(articleNo, callback);
		},
		getTagSummary: function(self_user, callback){
			_getTagSummary(self_user, callback);
		},
		getAuthorSummary: function(self_user, callback){
			_getAuthorSummary(self_user, callback);
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
		}
	}
}();
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
		let sqlString = " select top 10 a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" order by a.UpdateTime DESC ";
		
		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificAuthor(Id_No, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where Author = '" + Id_No + "'" +
						" order by a.UpdateTime DESC ";

		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificTag(tag, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime " +
						" from dbo.Article a " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where Tag = '" + tag + "'" +
						" order by a.UpdateTime DESC ";

		_executeSqlComment(sqlString, callback);
	}

	function _getSpecificArticle(articleNo, callback){
		let sqlString = " select a.articleNo, a.title, b.Card_Na as authorName, a.author, a.tag, a.updateTime, a.publishTime, a.content " +
						" from dbo.Article a " + 
						" left join HRIS.dbo.NEmployee b on a.Author = b.Id_No " + 
						" where ArticleNo = '" + articleNo + "'" +
						" order by a.UpdateTime DESC ";

		_executeSqlComment(sqlString, callback);
	}

	function _modifyArticle(article, callback){
		let sqlString = " update dbo.Article set title = '"+ article.title +"', content = '" +article.content+ "', Tag = '" +article.tag+ "', UpdateTime = getDate() where ArticleNo = '" + article.articleNo + "'";
		_executeSqlComment(sqlString, callback);
	}

	function _publishArticle(article, callback){
		let sqlString = " insert into  dbo.Article (title, Author, content, Tag, UpdateTime, PublishTime) "+
		                " values ('" +article.title +"','"+ article.author +"','"+ article.content +"','"+ article.tag +"', getDate(), getDate())";
		
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
		getSpecificTag : function(tag, callback){
			_getSpecificTag(tag, callback);
		},
		getSpecificArticle : function(articleNo, callback){
			_getSpecificArticle(articleNo, callback);
		},
		modifyArticle : function(article, callback){
			article.title = _replaceString(article.title);
			article.content = _replaceString(article.content);
			_modifyArticle(article, callback);
		},
		publishArticle : function(article, callback){
			article.title = _replaceString(article.title);
			article.content = _replaceString(article.content);
			_publishArticle(article, callback);
		}
	}
}();
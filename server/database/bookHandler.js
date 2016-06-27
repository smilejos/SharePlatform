"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = require('../config/database');

	function _createBook(book, callback){
		let sqlString = " insert into dbo.Book (Title, Author, Tag, UpdateTime, PublishTime, isPrivate)  "+
		                " values ('"+ book.title +"','"+ book.author +"','', getDate(), getDate(), '"+ book.isPrivate +"')";
		
		_executeSqlComment(sqlString, callback);
	}


	function _getSpecificBook(bookNo, callback){
		let sqlString = " select bookNo, title, author, updateTime, publishTime, isPrivate " +
						" from dbo.Book " + 
						" where BookNo = '" + bookNo + "'";

		_executeSqlComment(sqlString, callback);
	}

	function _executeSqlComment(sqlComment, callback) {
		sql.connect(config, (err) => {
			let request = new sql.Request();
	    	request.query(sqlComment, (err, recordset) => {
	    		callback(recordset, err);
	    		recordset = null;
	    	});
		});
	}

	function _replaceString(content) {
		let regex = /'/gi;
		return content.replace(regex, "''");
	}

	return {
		createBook: function(book, callback){
			_createBook(book, callback);
		},
		getSpecificBook: function(bookNo, callback){
			_getSpecificBook(bookNo, callback);
		}
	}
}();
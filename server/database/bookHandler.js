"use strict";
module.exports = function(){
	let sql = require('mssql'), 
		config = require('../config/database');

	function _createBook(book, callback){
		let sqlString = " insert into dbo.Book (Title, Author, Tag, UpdateTime, PublishTime, isPrivate)  "+
		                " values ('"+ book.title +"','"+ book.author +"','', getDate(), getDate(), '"+ book.isPrivate +"')";
		
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
		createBook: function(book, callback){
			_createBook(book, callback);
		}
	}
}();
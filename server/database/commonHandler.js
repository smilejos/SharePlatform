"use strict";
module.exports = function(){
	let catrgories = [],
		sql = require('mssql'), 
		config = require('../config/database');

	function _getCategory(callback) {
		let sqlComment = " select type, name from dbo.Category order by type, name";
		let connection = new sql.Connection(config, (err) => {
			let request = connection.request();
	    	request.query(sqlComment, (err, recordset) => {
	    		catrgories = recordset;
	    		recordset = null;
	    		callback();
	    	});
		});
	}

	return {
		initialize: function(){
			_getCategory( () => {
				console.log('start Category');
			});
		},
		getCategory : function(){
			if( !catrgories || catrgories.length == 0 ) {
				_getCategory( () => {
					return catrgories;
				});
			} else  {
				return catrgories;
			}
		},
	}
}();

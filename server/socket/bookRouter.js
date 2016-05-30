"use strict";

module.exports = function(){
	let is    = require('is_js');
	var BookHandler = require('../database/bookHandler');

	function _createBook(socket, item) {
		item.author = socket.request.session.user.UserName;
        BookHandler.createBook(item, (recordset, err) =>{
            if( err ) {
            	console.log('err', err);
            } else {
            	console.log('success');
            }
        });
	}

	return {
		listen: function(io, socket) {
			socket.on('createBook', (item) => {
		        _createBook(socket, item);
		    });
		}
	};
}();

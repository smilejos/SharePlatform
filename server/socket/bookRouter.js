"use strict";

module.exports = function(){
	let is    = require('is_js');
	var BookHandler = require('../database/bookHandler');

	function _createBook(socket, item) {
		item.author = socket.request.session.user.UserName;
        BookHandler.createBook(item, (recordset, err) =>{
            if( err ) {
            	console.log('createBook err', err);
            } else {
            }
        });
	}

	function _getSpecificBook(socket, item) {
        BookHandler.getSpecificBook(item, (book, err) =>{
            if( err ) {
            	console.log('retrieveBook err', err);
            } else {
            	book = is.array(book) ? book[0] : book;
	        	socket.emit('retrieveBook', book);
            }
        });
	}

	return {
		listen: function(io, socket) {
			socket.on('createBook', (item) => {
		        _createBook(socket, item);
		    });

		    socket.on('requestBook', (item) => {
		        _getSpecificBook(socket, item);
		    });
		}
	};
}();

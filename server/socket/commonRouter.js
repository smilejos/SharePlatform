"use strict";
module.exports = function(){
	let handler = require('../database/commonHandler');
	handler.initialize();

    function _getCategory(io) {
        io.emit('receiveCategory', handler.getCategory());
    };

	return {
		listen: function(io, socket) {
			// Send Category to client
		    _getCategory(io);
		}
	};
}();

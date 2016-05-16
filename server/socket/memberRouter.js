"use strict";
module.exports = function(){
	let handler = require('../database/memberHandler');
	handler.initialize();

	function _login(io, socket, item) {
		console.log('login item', item);
        socket.request.session.user.UserName = item.IdNo;
        let self = handler.setOnline(item.IdNo, socket.id); 

        console.log(self);

        io.emit('receiveRealTimeMember', {
            list : handler.getOnlineList(),
            self : self
        });
    };

    function _getEmployeeData(io, Id_No) {
        io.emit('retrieveUser', handler.getEmployee(Id_No));
    };


    function _sendMessage(socket, item) {
        socket.to(item.target).emit('receiveMessage', {
            sender : socket.request.session.user.UserName,
            message : item.message,
            dateTime : item.dateTime
        });
    };

     function _openChat(socket, item) {
        socket.to(item.target).emit('openChat', {
            target: item.target,
            Id_No: socket.request.session.user.UserName
        });
    };

    function _disconnect(io, socket) {
        console.log('Common disconnect', socket.id);
        // if(socket.request.session.user && socket.request.session.user.UserName){
        //     handler.setOffline(socket.request.session.user.UserName);
        //     io.emit('receiveRealTimeMember', {
        //         list :  handler.getOnlineList()
        //     });    
        // }
    };

	return {
		listen: function(io, socket) {
			console.log('Member connected', socket.id, socket.request.session.user);
			let user = socket.request.session.user;
		    if( user) {
		        let IdNo = user.UserName;
		        let self = handler.setOnline(IdNo);    

		        socket.emit('receiveRealTimeMember', {
		        	List : handler.getOnlineList(),
		        	self : self
		    	});
		    }

		    socket.on('getEmployeeData', (item) => {
		        _getEmployeeData(io, item);
		    });
				
			socket.on('login', (item) => {
		        _login(io, socket, item);
		    });

	     	socket.on('openChat', (item) => {
		       	_openChat(socket, item);
		    });

		    socket.on('sendMessage', (item) => {
		    	_sendMessage(socket, item);
		    }); 

		    socket.on('disconnect', () => {
		       _disconnect(io, socket);
		    });
		}
	};
}();

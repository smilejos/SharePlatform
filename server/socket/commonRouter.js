"use strict";
module.exports = function(){
	let handler = require('../database/memberHandler');
	handler.initialize();

	function _login(socket, client, item) {
		console.log('login item', item);
        client.request.session.user.UserName = item.IdNo;
        let self = handler.setOnline(item.IdNo, client.id); 
        socket.emit('receiveRealTimeMember', {
            list : handler.getOnlineList(),
            self : self
        });
    };

    function _sendMessage(client, item) {
        client.to(item.target).emit('receiveMessage', {
            sender : client.request.session.user.UserName,
            message : item.message,
            dateTime : item.dateTime
        });
    };

     function _openChat(client, item) {
        client.to(item.target).emit('openChat', {
            target: item.target,
            Id_No: client.request.session.user.UserName
        });
    };

    function _disconnect(socket, client) {
        console.log('Common disconnect', client.id);
        if(client.request.session.user && client.request.session.user.UserName){
            handler.setOffline(client.request.session.user.UserName);
            socket.emit('receiveRealTimeMember', {
                list :  handler.getOnlineList()
            });    
        }
    };

	return {
		listen: function(socket, client) {
			console.log('Common connected', client.id);
			/*let user = client.request.session.user;
		    if( user) {
		        let IdNo = user.UserName;
		        handler.setOnline(IdNo);    
		    }

		    client.emit('receiveRealTimeMember', {
		        List :  handler.getOnlineList()
		    });*/

			client.on('login', (item) => {
		        _login(socket, client, item);
		    });

	     	client.on('openChat', (item) => {
		       	_openChat(client, item);
		    });

		    client.on('sendMessage', (item) => {
		    	_sendMessage(client, item);
		    }); 

		    client.on('disconnect', () => {
		       _disconnect(socket, client);
		    });
		}
	};
}();

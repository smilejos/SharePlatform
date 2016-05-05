export function channelHandler() {
	let _channels = [];
	function _getChannel(Id_No){
		if( _channels.length > 0) {
			let _channel =  _channels.filter( (item) => {
            	return item.Id_No == Id_No;
        	})[0];
        	if( _channel ) {
				return _channel;
			} else {
				_addChannel(Id_No);
				return _channels[this._channels.length - 1];
			}
		} else {
			_addChannel(Id_No);
			return _channels[0];
		}
	};

	function _addChannel(Id_No){
		_channels.push({
            isOpen : true,
            Id_No : Id_No,
            message : new Array()
        });
	}

	return {
		setChannels: function(channels){
			_channels = channels;
		},
		getChannels: function(){
			return _channels;
		},
		getSpecificChannel: function(Id_No){
			return _getChannel(Id_No);
		},
		receiveMessage : function(message){
			var _channel = _getChannel(message.sender);
			_channel.message.push(message);
		},
		postMessage : function(message){
			var _channel = _getChannel(message.receiver);
			_channel.message.push(message);	
		},
		openChatBox: function(Id_No) {
			var _channel = _getChannel(Id_No);
			_channel.isOpen = true;
		},
		closeChatBox: function(Id_No) {
			var _channel = _getChannel(Id_No);
			_channel.isOpen = false;
		}
	}
};
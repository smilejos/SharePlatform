"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.channelHandler = channelHandler;
function channelHandler() {
	var _channels = [];
	function _getChannel(Id_No) {
		if (_channels.length > 0) {
			var _channel = _channels.filter(function (item) {
				return item.Id_No == Id_No;
			})[0];
			if (_channel) {
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

	function _addChannel(Id_No) {
		_channels.push({
			isOpen: true,
			Id_No: Id_No,
			message: new Array()
		});
	}

	return {
		setChannels: function setChannels(channels) {
			_channels = channels;
		},
		getChannels: function getChannels() {
			return _channels;
		},
		getSpecificChannel: function getSpecificChannel(Id_No) {
			return _getChannel(Id_No);
		},
		receiveMessage: function receiveMessage(message) {
			var _channel = _getChannel(message.sender);
			_channel.message.push(message);
		},
		postMessage: function postMessage(message) {
			var _channel = _getChannel(message.receiver);
			_channel.message.push(message);
		},
		openChatBox: function openChatBox(Id_No) {
			var _channel = _getChannel(Id_No);
			_channel.isOpen = true;
		},
		closeChatBox: function closeChatBox(Id_No) {
			var _channel = _getChannel(Id_No);
			_channel.isOpen = false;
		}
	};
};
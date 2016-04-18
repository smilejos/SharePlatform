"use strict";
module.exports = function(){
	var ArticleHandler = require('../database/articleHandler');

	function _publishArticle(client, item) {
		item.Author = client.request.session.user.UserName;
        ArticleHandler.publishArticle(item, (recordset, err) =>{
            console.log('recordset', recordset);
            console.log('err', err);
        });
	}

	function _updateArticle(client, item) {
		item.Author = client.request.session.user.UserName;
        ArticleHandler.modifyArticle(item, (recordset, err) =>{
            console.log('recordset', recordset);
            console.log('err', err);
        });
	}

	function _getArticle(client, item) {
		console.log('articleNo', item);
	    ArticleHandler.getSpecificArticle(item, (article) => {
	        client.emit('retrieveArticle', article);
	    });
	}

	function _getArticleList(client, item) {
		if(item.isSpecificUser) {
            ArticleHandler.getSpecificAuthor(item.Id_No, (list) => {
                client.emit('receiveList', list);
            });
            
        } else {
            ArticleHandler.getNewestArticle( (list) => {
                client.emit('receiveList', list);
            });
        }
	}

	return {
		listen: function(client) {
			console.log('Article connected', client.id);
			client.on('publish', (item) => {
				console.log("define publish");
		        _publishArticle(client, item);
		    });

		    client.on('update', (item) => {
		    	console.log("define update");
		    	_updateArticle(client, item);
		    }); 

		    client.on('retrieveArticle', (item) => {
		    	console.log("define retrieveArticle");
		       _getArticle(client, item);
		    });

		    client.on('retrieveList', (item) => {
		    	console.log("define retrieveList");
		       _getArticleList(client, item);
		    });

		    client.on('disconnect', () => {
		        console.log('Article disconnect', client.id);
		    });
		}
	};
}();

"use strict";

module.exports = function(){
	let util    = require('../utility/util');
	var ArticleHandler = require('../database/articleHandler');

	function _publishArticle(client, item) {
		item.Author = client.request.session.user.UserName;
        ArticleHandler.publishArticle(item, (recordset, err) =>{
            if( err ) {
            	
            } else {
            	
            }
        });
	}

	function _updateArticle(client, item) {
		item.Author = client.request.session.user.UserName;
        ArticleHandler.modifyArticle(item, (recordset, err) =>{
            if( err ) {
            	
            } else {
            	
            }
        });
	}

	function _getArticle(client, item) {
	    ArticleHandler.getSpecificArticle(item, (article) => {
	        client.emit('retrieveArticle', article);
	    });
	}

	function _getArticleList(client, item) {
		if(item.isSpecificUser) {
			console.log('_getArticleList SpecificUser', item.Id_No);
            ArticleHandler.getSpecificAuthor(item.Id_No, (list) => {
                client.emit('receiveList', list);
            });
            
        } else {
        	console.log('_getArticleList Non SpecificUser');
            ArticleHandler.getNewestArticle( (list) => {
                client.emit('receiveList', list);
            });
        }
	}

	function _updateTimeZone(item)
	{
		//To-Do Update all timezone
	}

	return {
		listen: function(client) {
			console.log('Article connected', client.id);
			client.on('publishArticle', (item) => {
				console.log("define publish");
		        _publishArticle(client, item);
		    });

		    client.on('updateArticle', (item) => {
		    	console.log("define update");
		    	_updateArticle(client, item);
		    }); 

		    client.on('requestArticle', (item) => {
		    	console.log("define requestArticle");
		       _getArticle(client, item);
		    });

		    client.on('requestArticleList', (item) => {
		    	console.log("define requestArticleList");
		       _getArticleList(client, item);
		    });

		    client.on('disconnect', () => {
		        console.log('Article disconnect', client.id);
		    });
		}
	};
}();

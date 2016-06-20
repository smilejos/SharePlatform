"use strict";

module.exports = function(){
	let is    = require('is_js');
	let ArticleHandler = require('../database/articleHandler');
	let lodash  = require('lodash');

	function _createArticle(socket, item) {
		item.author = socket.request.session.user.UserName;
        ArticleHandler.createArticle(item, (recordset, err) =>{
            if( err ) {
            	console.log('err', err);
            } else {
            	console.log('success');
            }
        });
	}

	function _modifyArticle(socket, item) {
        ArticleHandler.modifyArticle(item, (recordset, err) =>{
             if( err ) {
            	console.log('err', err);
            } else {
            	console.log('success');
            }
        });
	}

	function _updateArticle(socket, item) {
		item.tag = item.tag.length > 0 ? item.tag.join(',') : '';
        ArticleHandler.updateArticle(item, (recordset, err) =>{
             if( err ) {
            	console.log('err', err);
            } else {
            	console.log('success');
            }
        });
	}

	function _searchArticles(socket, item) {
		item.author = socket.request.session.user.UserName;
		item.keyword = item.keyword.length > 0 ? item.keyword.split(' ') : [];
		ArticleHandler.getSearchArticles(item, (articles, err) => {
	    	articles = is.array(articles) ? articles : [];
	    	lodash.forEach(articles, function(item, index){
	    		item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    	});
	        socket.emit('receiveList', articles);
	    });
	}

	function _getArticle(socket, item) {
	    ArticleHandler.getSpecificArticle(item, (article, err) => {
	    	article = is.array(article) ? article[0] : article;
	    	article.tag = article.tag.length > 0 ? article.tag.split(',') : [];
	        socket.emit('retrieveArticle', article);
	    });
	}

	function _getArticleList(socket, item) {
		if(item.isSpecificUser) {
			// console.log('_getArticleList SpecificUser', item.Id_No);
            ArticleHandler.getSpecificAuthor(item.Id_No, (articles, err) => {
            	lodash.forEach(articles, function(item, index){
	    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    		});
                socket.emit('receiveList', articles);
            });
            
        } else {
        	// console.log('_getArticleList Non SpecificUser');
            ArticleHandler.getNewestArticle( (articles, err) => {
            	lodash.forEach(articles, function(item, index){
	    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    		});
                socket.emit('receiveList', articles);
            });
        }
	}

	function _updateTimeZone(item)
	{
		//To-Do Update all timezone
	}

	return {
		listen: function(io, socket) {
			
			socket.on('createArticle', (item) => {
				// console.log("define publish");
		        _createArticle(socket, item);
		    });

			socket.on('modifyArticle', (item) => {
		    	// console.log("define update");
		    	_modifyArticle(socket, item);
		    }); 

		    socket.on('updateArticle', (item) => {
		    	console.log('socket event', item);
		    	_updateArticle(socket, item);
		    }); 

		    socket.on('requestArticle', (item) => {
		    	// console.log("define requestArticle");
		       _getArticle(socket, item);
		    });

		    socket.on('searchArticles', (item) => {
		    	// console.log("define requestArticle");
		       _searchArticles(socket, item);
		    });


		    socket.on('syncArticle', (articleNo) => {
		    	// console.log("define requestArticle");
		    	socket.join(articleNo);
		    });
		    
		    socket.on('leaveArticle', (articleNo) => {
		    	// console.log("define requestArticle");
		    	socket.leave (articleNo);
		    });

		    socket.on('requestArticleList', (item) => {
		    	// console.log("define requestArticleList");
		       _getArticleList(socket, item);
		    });

		    socket.on('disconnect', () => {
		        // console.log('Article disconnect', socket.id);
		    });

	     	socket.on('editArticle', (item) => {
		        //socket.broadcast.emit('editArticle', item);
		        socket.broadcast.to(item.articleNo).emit('editArticle', item);
		    });
		}
	};
}();

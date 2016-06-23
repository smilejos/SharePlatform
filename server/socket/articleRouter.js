"use strict";

module.exports = function(){
	let is    = require('is_js');
	let ArticleHandler = require('../database/articleHandler');
	let lodash  = require('lodash');
	let notice = {
		level : 'success',
		title : 'Article Notice',
		message: '',
		datetime: Date.now()
	}

	function _createArticle(socket, item) {
		item.author = socket.request.session.user.UserName;
        ArticleHandler.createArticle(item, (recordset, err) =>{
            if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'create article success',
            		datetime: Date.now()
            	}));
            }
        });
	}

	function _modifyArticle(socket, item) {
        ArticleHandler.modifyArticle(item, (recordset, err) =>{
             if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'update article content success',
            		datetime: Date.now()
            	}));
            }
        });
	}

	function _updateArticle(socket, item) {
		item.tag = item.tag.length > 0 ? item.tag.join(',') : '';
        ArticleHandler.updateArticle(item, (recordset, err) =>{
             if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'update article setting success',
            		datetime: Date.now()
            	}));
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
	    	if( err || article == null) {
    			socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
	    	} else {
	    		article = is.array(article) ? article[0] : article;
	    		article.tag = article.tag.length > 0 ? article.tag.split(',') : [];
	        	socket.emit('retrieveArticle', article);	
	    	}
	    	
	    });
	}

	function _getArticleList(socket, item) {
		let self_user = socket.request.session.user.UserName;
		if(item.isSpecificUser) {
			// console.log('_getArticleList SpecificUser', item.Id_No);
            ArticleHandler.getArticlesByAuthor(item.Id_No, self_user, (articles, err) => {
            	lodash.forEach(articles, function(item, index){
	    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    		});
                socket.emit('receiveList', articles);
            });
            
        } else {
        	// console.log('_getArticleList Non SpecificUser');
            ArticleHandler.getNewestArticle(self_user, (articles, err) => {
            	lodash.forEach(articles, function(item, index){
	    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    		});
                socket.emit('receiveList', articles);
            });
        }
	}

	function _getArticlesByTag(socket, item) {
		let self_user = socket.request.session.user.UserName;
		ArticleHandler.getArticlesByTag(item, self_user, (articles, err) => {
        	lodash.forEach(articles, function(item, index){
    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
    		});
            socket.emit('receiveList', articles);
        });
	}

	function _getArticlesByAuthor(socket, item) {
		let self_user = socket.request.session.user.UserName;
		ArticleHandler.getArticlesByAuthor(item, self_user, (articles, err) => {
        	lodash.forEach(articles, function(item, index){
    			item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
    		});
            socket.emit('receiveList', articles);
        });
	}

	function _getTagSummary(socket) {
		let self_user = socket.request.session.user.UserName;
		ArticleHandler.getTagSummary(self_user, (articles, err) => {
	    	articles = is.array(articles) ? articles : [];
	    	lodash.forEach(articles, function(item, index){
	    		item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    	});
	        socket.emit('receiveList', articles);
	    });
	}

	function _getAuthorSummary(socket) {
		let self_user = socket.request.session.user.UserName;
		ArticleHandler.getAuthorSummary(self_user, (articles, err) => {
	    	articles = is.array(articles) ? articles : [];
	    	lodash.forEach(articles, function(item, index){
	    		item.tag = item.tag.length > 0 ? item.tag.split(',') : [];
	    	});
	        socket.emit('receiveList', articles);
	    });
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
		    	socket.leave(articleNo);
		    });

		    socket.on('requestArticleList', (item) => {
		    	// console.log("define requestArticleList");
		       _getArticleList(socket, item);
		    });

	     	socket.on('requestArticlesByTag', (item) => {
		       _getArticlesByTag(socket, item);
		    });

	      	socket.on('requestArticlesByAuthor', (item) => {
		       _getArticlesByAuthor(socket, item);
		    });

		    socket.on('requestTagSummary', () => {
		       _getTagSummary(socket);
		    });

		    socket.on('requestAuthorSummary', () => {
		       _getAuthorSummary(socket);
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

module.exports = function(){
	let is    = require('is_js');
	let ss    = require('socket.io-stream');
	let fs    = require('fs');
	let path  = require('path');
	let ArticleHandler = require('../database/articleHandler');
    let lodash = require('lodash');
    let Promise = require("bluebird");
	let notice = {
		level : 'success',
		title : 'Article Notice',
		message: '',
		datetime: Date.now()
	}

	function _createArticle(socket, item) {
		item.author = socket.request.session.user.WorkerNo;
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
        item.editor = socket.request.session.user.WorkerNo;
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
        item.editor = socket.request.session.user.WorkerNo;
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
		item.worker_no = socket.request.session.user.WorkerNo;
		item.keyword = item.keyword.length > 0 ? item.keyword.split(' ') : [];
		ArticleHandler.getSearchArticles(item, (articles, err) => {
	    	articles = is.array(articles) ? articles : [];
	    	articles = _separateByTag(articles);
	        socket.emit('receiveList', articles);
	        articles = null;
	    });
	}

    function _getArticle(socket, articleNo) {
        let getSpecificArticle = function () {
            return new Promise(function (resolve, reject) {
                ArticleHandler.getSpecificArticle(articleNo, (article, err) => {
                    if (err || article == null ) {
                        reject(err);
                    } else {
                        article = is.array(article) ? article[0] : article;
                        article.tag = article.tag && article.tag.length > 0 ? article.tag.split(',') : [];
                        resolve(article);
                    }
                });
            });
        };

        let getCoEditors = function () {
            return new Promise(function (resolve, reject) {
                ArticleHandler.getCollaboratedEditors(articleNo, (editors, err) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (is.array(editors) && editors.length > 0) {
                            editors = editors.map(function (obj, index) { 
                                return obj.editor;
                            });
                        } else {
                            editors = [];
                        }
                        resolve(editors);
                    }
                });
            });
        };

        Promise.all([getSpecificArticle(), getCoEditors()]).spread(function (article, editors) { 
            article.editors = editors;
            socket.emit('retrieveArticle', article);
        }).catch(function (err) { 
            socket.emit('receiveNotice', lodash.assign(notice, {
                level: 'error',
                message: err,
                datetime: Date.now()
            }));
        })
    }
    
    function _getArticleImages(socket, item) {
        ArticleHandler.getArticleImages(item, (list, err) => {
            if (err) {
                socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            	list = null;
            } else {
	        	socket.emit('retrieveArticleImages', list);	
	        	list = null;
	    	}
	    });
    }
	
	function _getArticlesByTag(socket, item) {
		let worker_no = socket.request.session.user.WorkerNo;
		ArticleHandler.getArticlesByTag(item, worker_no, (articles, err) => {
        	articles = _separateByTag(articles);
            socket.emit('receiveList', articles);
            articles = null;
        });
	}

	function _getArticlesByAuthor(socket, item) {
        let worker_no = socket.request.session.user.WorkerNo;
        if (item.worker_no == worker_no) {
            ArticleHandler.getArticlesBySelf(item.worker_no, (articles, err) => {
                articles = _separateByTag(articles);
                socket.emit('receiveList', articles);
                articles = null;
            });
        } else {
            ArticleHandler.getArticlesByAuthor(item.worker_no, (articles, err) => {
                articles = _separateByTag(articles);
                socket.emit('receiveList', articles);
                articles = null;
            });
        }
	}

	function _getTagSummary(socket) {
		let worker_no = socket.request.session.user.WorkerNo;
		ArticleHandler.getTagSummary(worker_no, (articles, err) => {
            articles = _separateByTag(articles);
	        socket.emit('receiveList', articles);
	        articles = null;
	    });
	}

	function _getAuthorSummary(socket) {
		let worker_no = socket.request.session.user.WorkerNo;
        ArticleHandler.getAuthorSummary(worker_no, (articles, err) => {
            articles = _separateByTag(articles);
	        socket.emit('receiveList', articles);
	        articles = null;
	    });
    }
    
    function _assignCoEditor(socket, item) {
        ArticleHandler.assignCollaboratedEditor(item.article_no, item.worker_no, (recordset, err) => {
            if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'assign article co-editor success',
            		datetime: Date.now()
            	}));
            }
	    });
    }

    function _removeCoEditor(socket, item) {
         ArticleHandler.deleteCollaboratedEditor(item.article_no, item.worker_no, (recordset, err) => {
           if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'remove article co-editor success',
            		datetime: Date.now()
            	}));
            }
	    });
    }

	function _uploadArticle(socket, item) {
		ArticleHandler.modifyArticle(item, (recordset, err) =>{
             if( err ) {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		level: 'error',
            		message: err,
            		datetime: Date.now()
            	}));
            } else {
            	socket.emit('receiveNotice', lodash.assign(notice, {
            		message: 'upload article content success',
            		datetime: Date.now()
            	}));

            	ArticleHandler.getSpecificArticle(item.articleNo, (article, err) => {
			    	if( err || article == null) {
		    			socket.emit('receiveNotice', lodash.assign(notice, {
		            		level: 'error',
		            		message: err,
		            		datetime: Date.now()
		            	}));
		            	article = null;
			    	} else {
			    		article = is.array(article) ? article[0] : article;
                        article.tag = article.tag && article.tag.length > 0 ? article.tag.split(',') : [];
                        article.author_name = article.card_na.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
			        	socket.emit('retrieveArticle', article);	
			        	article = null;
			    	}
			    });
            }
        });
	}

    function _updateTimeZone(item) {
        //To-Do Update all timezone
    }

    function _separateByTag(articles, err) {
        lodash.forEach(articles, function(item, index){
            item.tag = item.tag && item.tag.length > 0 ? item.tag.split(',') : [];
            item.author_name = item.card_na ? item.card_na.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "";
        });
        return articles;
    }

	return {
        listen: function(io, socket) {
			socket.on('createArticle', (item) => {
		        _createArticle(socket, item);
		    });

			socket.on('modifyArticle', (item) => {
		    	_modifyArticle(socket, item);
		    }); 

		    socket.on('updateArticle', (item) => {
		    	_updateArticle(socket, item);
		    }); 

		    socket.on('requestArticle', (item) => {
		       _getArticle(socket, item);
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
            
            socket.on('requestArticleImages', (item) => {
		       _getArticleImages(socket, item);
            });

		    socket.on('searchArticles', (item) => {
		       _searchArticles(socket, item);
		    });

		    socket.on('syncArticle', (articleNo) => {
		    	socket.join(articleNo);
		    });
		    
		    socket.on('leaveArticle', (articleNo) => {
		    	socket.leave(articleNo);
            });

            socket.on('assignCoEditor', (item) => {
		       _assignCoEditor(socket, item);
            });
            
            socket.on('removeCoEditor', (item) => {
		       _removeCoEditor(socket, item);
            });
            

		    socket.on('disconnect', () => {
		    });

	     	socket.on('editArticle', (item) => {
		        socket.broadcast.to(item.articleNo).emit('editArticle', item);
		    });

		    ss(socket).on('upload', (stream, item) => {
		    	let content = '';
		    	stream.on('data', function(chunk) {
				    content+=chunk;
				});
				stream.on('end', function() {
				    _uploadArticle(socket, {
				    	content: content,
				    	articleNo: item
				    });
				});
		    });
		}
	};
}();

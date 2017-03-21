let memberRouter        = require('../socket/memberRouter');
let articleRouter       = require('../socket/articleRouter');
let bookRouter          = require('../socket/bookRouter');
let commonRouter        = require('../socket/commonRouter');

module.exports = function (socket, sessionMiddleware) {

    let member = socket.of('/Member');
    let article = socket.of('/Article');
    let book = socket.of('/Book');
    let common = socket.of('/Common');

    socket.use(function(socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    socket.on('connection', (client) => {
        console.log('sockets connected', client.id);
        client.on('disconnect', () => {
        console.log('sockets disconnect', client.id);
        });
    });

    member.on('connection', (client) => {
        memberRouter.listen(member, client);
    });

    article.on('connection', (client) => {
        articleRouter.listen(article, client);
    });

    book.on('connection', (client) => {
        bookRouter.listen(book, client);
    });

    common.on('connection', (client) => {
        commonRouter.listen(common, client);
    });
};
let React                 = require('react');
let serialize             = require('serialize-javascript');
let renderToString        = require('react-dom/server').renderToString;
let Provider              = require('react-redux').Provider;
let router 		  		  = require('react-router');
let syncHistoryWithStore  = require('react-router-redux').syncHistoryWithStore;
let configureStore		  = require('../../lib/store/index').configureStore;
let routes                = require('../../lib/components/main/routes').default;
let memberRouter          = require('../socket/memberRouter');
let RouterContext 		  = router.RouterContext;
let createMemoryHistory   = router.createMemoryHistory;
let match                 = router.match;

function renderFullPage(content, store) {
  return `
    <!doctype html>
    <html>
		<head>
			<title>Biz Share Platform</title>
            <meta http-equiv="X-UA-Compatible" content="chrome=1" />
            <link rel="icon" href="/Sharing.png" />
            <link rel="stylesheet" href="/style.css" type="text/css" />
		</head>
		<body>
			<div id='app'>${content}</div>
			<script>
          		window.__INITIAL_STATE__ = ${serialize(store.getState())}
        	</script>
            <script src="/bower-webfontloader/webfont.js"></script>
            <script src="/snap.svg/dist/snap.svg-min.js"></script>
            <script src="/underscore/underscore-min.js"></script>
            <script src="/js-sequence-diagrams/dist/sequence-diagram.js"></script>
            
            <script src="/raphael/raphael.js"></script>
            <script src="/flowchart/release/flowchart.js"></script>
            
            <script src="/mermaid/dist/mermaid.min.js"></script>
            
            <script src="/bundle.js"></script>
		</body>
	</html>
    `
}

function handleRender(req, res) {
    let user = memberRouter.transfer(req.ntlm);
    if (user) {
        req.session.user = user;
        const memoryHistory = createMemoryHistory(req.url);
        const store = configureStore(memoryHistory);
        const history = syncHistoryWithStore(memoryHistory, store);

        match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
                res.status(500).send(error.message)
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {

            const content = renderToString(React.createElement(
                Provider, { store: store }, React.createElement(RouterContext, renderProps)
                ));
            res.send(renderFullPage(content, store));
            } else {
                res.status(404).send('Not found');
            }
        })
    } else {
        res.status(301).send("Your account is not available.");
    }
    
}

module.exports = handleRender;

let react_router 		  = require('react-router');
let Provider 			  = require('react-redux').Provider;
let configureStore		  = require('../../lib/store/index.js');
let routes 		  		  = require('../../lib/components/main/routes.js');
let syncHistoryWithStore  = require('react-router-redux').syncHistoryWithStore;
let ReactDOMServer        = require('react-dom/server');
let RouterContext 		  = react_router.RouterContext;

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
		<head>
			<title>Biz Talk</title>
			<link rel="stylesheet" href="style.css" type="text/css" />
			<link rel="stylesheet" href="codeStyle.css" type="text/css" />
			<link rel="stylesheet" href="markdown.css" type="text/css" />	
			<link rel="stylesheet" href="font-awesome.css" type="text/css" />	
		</head>
		<body>
			<div id='app'>${html}</div>
			<script>
          		window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        	</script>
			<script src="bundle.js"></script>
		</body>
	</html>
    `
}

function handleRender(req, res) {
	
  	const memoryHistory = react_router.createMemoryHistory(req.url)
  	const store = configureStore(memoryHistory)
  	const history = syncHistoryWithStore(memoryHistory, store)
	const initialState = store.getState();

  	react_router.match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    	if (error) {
      		res.status(500).send(error.message)
    	} else if (redirectLocation) {
      		res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    	} else if (renderProps) {
			const html = ReactDOMServer.renderToString(React.createElement(
				Provider, { store: store }, React.createElement(RouterContext, renderProps)
			));

			console.log('html', html);
			res.send(renderFullPage(html, initialState));
    	}
  	})
}

module.exports = handleRender;
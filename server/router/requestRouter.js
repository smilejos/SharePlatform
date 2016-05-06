let React                 = require('react');
let serialize             = require('serialize-javascript');
let renderToString        = require('react-dom/server').renderToString;
let Provider              = require('react-redux').Provider;
let router 		  		  = require('react-router');
let syncHistoryWithStore  = require('react-router-redux').syncHistoryWithStore;
let configureStore		  = require('../../lib/store/index').configureStore;
let routes 		  		  = require('../../lib/components/main/routes').default;
let RouterContext 		  = router.RouterContext;
let createMemoryHistory   = router.createMemoryHistory;
let match                 = router.match;

// import React                                         from 'react'
// import serialize                                     from 'serialize-javascript'
// import { renderToString }                            from 'react-dom/server'
// import { Provider }                                  from 'react-redux'
// import { createMemoryHistory, match, RouterContext } from 'react-router'
// import { syncHistoryWithStore }                      from 'react-router-redux'
// import { configureStore }                            from '../../public/store/index'
// import routes                                        from'../../public/components/main/routes'

function renderFullPage(content, store) {
  return `
    <!doctype html>
    <html>
		<head>
			<title>Biz Talk</title>
			<link rel="stylesheet" href="/style.css" type="text/css" />
			<link rel="stylesheet" href="/codeStyle.css" type="text/css" />
			<link rel="stylesheet" href="/markdown.css" type="text/css" />	
			<link rel="stylesheet" href="/font-awesome.css" type="text/css" />	
		</head>
		<body>
			<div id='app'>${content}</div>
			<script>
          		window.__INITIAL_STATE__ = ${serialize(store.getState())}
        	</script>
			<script src="/bundle.js"></script>
		</body>
	</html>
    `
}

// const HTML = ({ content, store }) => (
//   	<html>
// 		<head>
// 			<title>Biz Talk</title>
// 			<link rel="stylesheet" href="style.css" type="text/css" />
// 			<link rel="stylesheet" href="codeStyle.css" type="text/css" />
// 			<link rel="stylesheet" href="markdown.css" type="text/css" />	
// 			<link rel="stylesheet" href="font-awesome.css" type="text/css" />	
// 		</head>
// 		<body>
//       		<div id="app" dangerouslySetInnerHTML={{ __html: content }}/>
//       		<script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store.getState())};` }}/>
//       		<script src="bundle.js"></script>
//     	</body>
//   	</html>
// )

function handleRender(req, res) {
  	const memoryHistory = createMemoryHistory(req.url);
  	const store = configureStore(memoryHistory);
  	const history = syncHistoryWithStore(memoryHistory, store);

  	match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    	if (error) {
      		res.status(500).send(error.message)
    	} else if (redirectLocation) {
      		res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    	} else if (renderProps) {
    		// const content = renderToString(
		    //     <Provider store={store}>
		    //       	<RouterContext {...renderProps}/>
		    //     </Provider>
            //  	)
            const content = renderToString(React.createElement(
                Provider, { store: store }, React.createElement(RouterContext, renderProps)
		    ));
      		//res.send('<!doctype html>\n' + renderToString(<HTML content={content} store={store}/>))
			
            res.send(renderFullPage(content, store));
    	} else {
    		res.status(404).send('Not found');
    	}
  	})
}

module.exports = handleRender;
import React                                         from 'react'
import serialize                                     from 'serialize-javascript'
import { renderToString }                            from 'react-dom/server'
import { Provider }                                  from 'react-redux'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore }                      from 'react-router-redux'
import { configureStore }                            from '../../public/store/index'
import routes                                        from '../../public/components/main/routes'

const HTML = ({ content, store }) => (
  	<html>
		<head>
			<title>Biz Share Platform</title>
			<link rel="stylesheet" href="/style.css" type="text/css" />
			<link rel="stylesheet" href="/codeStyle.css" type="text/css" />
			<link rel="stylesheet" href="/markdown.css" type="text/css" />	
			<link rel="stylesheet" href="/font-awesome.css" type="text/css" />	
      <link rel="stylesheet" href="/react-select.css" type="text/css" />
		</head>
		<body>
      		<div id="app" dangerouslySetInnerHTML={{ __html: content }}/>
      		<script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store.getState())};` }}/>
      		<script src="/bundle.js"></script>
    	</body>
  	</html>
)

function handleRender(req, res) {
    req.session.user = req.ntlm;
  	const memoryHistory = createMemoryHistory(req.url);
  	const store = configureStore(memoryHistory);
  	const history = syncHistoryWithStore(memoryHistory, store);

  	match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    	if (error) {
      		res.status(500).send(error.message)
    	} else if (redirectLocation) {
      		res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    	} else if (renderProps) {
    		const content = renderToString(
		        <Provider store={store}>
		          	<RouterContext {...renderProps}/>
		        </Provider>
       	)
      	res.send('<!doctype html>\n' + renderToString(<HTML content={content} store={store}/>))
    	} else {
    		res.status(404).send('Not found');
    	}
  	})
}

module.exports = handleRender;
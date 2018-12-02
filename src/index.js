import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'

import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { initializeIcons } from '@uifabric/icons';
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker';
import { ConnectedRouter } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'


const  history = createHistory()
const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]
initializeIcons()

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
)

const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composedEnhancers
)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
        <App store={store}/>
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();

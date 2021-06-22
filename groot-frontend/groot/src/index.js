import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

import axios from 'axios'
import { BrowserRouter as Router, Route } from 'react-router-dom';

// redux
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

// setting the default axios settings to be used throughout the project
axios.defaults.xsrfCookieName = 'groot_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true


const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(

    <Provider store={store} >
        <React.StrictMode>
            <Router>
                <Route path='/' component={App} />
            </Router>
        </React.StrictMode>
    </Provider>,

    document.getElementById('root')

);


import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import App from "./components/specific/App/App";
import {Router} from "react-router";
import BrowserRouter from "./data/Routers/BrowserRouter";

import 'antd/dist/antd.css';

ReactDOM.render(
    <Router history={BrowserRouter.history}>
        <App />
    </Router>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

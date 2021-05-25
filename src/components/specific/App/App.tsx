import React, {Component} from 'react';

import './styles.scss';

import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router";
import AppStore from "../../../data/App/Store";
import {BrowserRoutes} from "../../../data/Routers/BrowserRouter";
import ModalRouter from "../FixedComponentsRouters/ModalRouter";
import DrawerRouter from "../FixedComponentsRouters/DrawerRouter";

/* App Imports */
import PosenetPage from "../Posenet/Page/Page"

import {IndeterminateLoader} from "../../common/IndeterminateLoader/IndeterminateLoader";
import {observer} from "mobx-react";
import {Scrollable} from "../../common/Scrollable/Scrollable";
import {SETTINGS} from "../../../global/settings";

AppStore.initialize();

class App extends Component<RouteComponentProps, any> {

    onLogoClick = () => {
        window.location.href = SETTINGS.M3.HOME_PAGE_URL;
    };

    render() {

        if (!AppStore.necessaryDataIsLoaded) return (
            <div className='loading-app'>
                <div className='text'>Loading...</div>
                <IndeterminateLoader className='app-indeterminate-loader'/>
            </div>
        );

        return (
            <Scrollable className='scrollable-app' scrollY>
                <div className='app'>
                    <header className='header'>

                        <img className='logo'
                             onClick={this.onLogoClick}
                             src='https://www.texaschildrens.org/sites/default/files/logo.png'/>
                    </header>
                    <Switch>
                        /* Data Routes */
                        <Route path={BrowserRoutes.home} component={PosenetPage}/>

                        <Redirect to={BrowserRoutes.home}/>
                    </Switch>
                    <ModalRouter/>
                    <DrawerRouter/>
                </div>
            </Scrollable>
        );
    }
}

export default withRouter(observer(App));

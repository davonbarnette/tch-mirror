import React, {Component} from 'react';
import {observer} from "mobx-react";
import AppStore from "../../../data/App/Store";
import {DRAWERS_BY_ID} from "../../../data/App/Types";

class DrawerRouter extends Component {

    render(){
        if (!AppStore.drawer) return null;
        switch(AppStore.drawer){
            case DRAWERS_BY_ID.EXAMPLE_DRAWER:
                return null;
            default:
                return null;

        }
    }
}

export default observer(DrawerRouter);


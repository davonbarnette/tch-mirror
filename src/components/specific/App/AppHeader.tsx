import {SingleHeaderItem} from "../../common/Header/types";
import React, {Component} from "react";
import Header from "../../common/Header/Header";
import {RouteComponentProps, withRouter} from "react-router";

export const MAIN_HEADER_ITEMS:SingleHeaderItem[] = [

];

interface AppHeaderProps extends RouteComponentProps {

}

class AppHeader extends Component<AppHeaderProps, any> {

    render(){
        return <Header headerItems={MAIN_HEADER_ITEMS}/>
    }
}

export default withRouter(AppHeader);

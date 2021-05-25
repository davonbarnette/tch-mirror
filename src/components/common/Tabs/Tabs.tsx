import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import cx from 'classnames';
import './styles.scss';

import {Flex} from "../Flex/Flex";
import {SingleTab} from "./types";
import Tab from "./Tab";

interface TabsProps extends RouteComponentProps {
    tabs:SingleTab[];
    className?:string,
}

class Tabs extends Component<TabsProps, any> {

    get tabs() {
        const {tabs} = this.props;
        return tabs.map((item:SingleTab, key:number) => {
            const { label, icon, onClick, selected } = item;

            let handleOnClick = (e:MouseEvent) => onClick(e);
            let args = {key, onClick:handleOnClick, selected, icon, label};

            return <Tab {...args}/>
        })
    }

    render(){
        const {className} = this.props;
        return(
            <Flex className={cx('tabs', className || '')}>
                {this.tabs}
            </Flex>
        )
    }
}

export default withRouter(Tabs);

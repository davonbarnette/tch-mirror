import React, {Component} from 'react';
import BrowserRouter, {BrowserRoutes} from "../../../data/Routers/BrowserRouter";
import {RouteComponentProps, withRouter} from "react-router";
import cx from 'classnames';
import * as Icon from 'react-feather';

import './styles.scss';

import {SingleHeaderItem} from "./types";
import {Flex} from "../Flex/Flex";
import AppStore from "../../../data/App/Store";

interface NavButtonProps {
    onClick:(e:MouseEvent)=>void,
    label:string,
    selected:boolean,
    icon?:any,
    collapsed?:boolean,
}

const NavButton = (props:NavButtonProps) => {
    const { onClick, label, selected, icon, collapsed } = props;
    let color = selected ? '#5d84e4' : '#cccccc';

    let className = cx('navigate-to', { selected });
    let containerArgs = { className, onClick };
    return (
        <span {...containerArgs as any} >
            {icon ? icon(color) : null}
            <div className='text' style={{display: collapsed ? 'none' : 'block'}}>{label}</div>
        </span>
    )
};

interface HeaderProps extends RouteComponentProps {
    headerItems:SingleHeaderItem[]
}

interface HeaderState {
    collapsed:boolean,
}

class Header extends Component<HeaderProps, HeaderState> {

    state:HeaderState = {
        collapsed:false,
    };

    constructor(props:HeaderProps){
        super(props);
        this.state.collapsed = JSON.parse(localStorage.getItem('navCollapsed') || 'false');
    }

    handleOnNavigateClick = (e:MouseEvent,path:string) => {
        e.stopPropagation();
        BrowserRouter.push(path);
    };

    onCollapseClick = () => {
        const {collapsed} = this.state;
        localStorage.setItem('navCollapsed', JSON.stringify(!collapsed as any));
        this.setState({collapsed:!collapsed});
    };

    isCurrentPath(path:string){
        const { pathname } = this.props.location;
        return pathname.startsWith(path);
    }

    get navItems() {

        const {headerItems} = this.props;

        return headerItems.map((item:SingleHeaderItem, key:number) => {
            const { collapsed } = this.state;
            const { path, label, icon } = item;

            let onClick = (e:MouseEvent) => this.handleOnNavigateClick(e, path);
            let selected = this.isCurrentPath(path);
            let args = {key, onClick, selected, icon, label, collapsed};

            return <NavButton {...args}/>
        })
    }

    get company(){
        const { collapsed } = this.state;
        if (collapsed) return null;
        else return (
            <Flex className='company'>
                <span className='second'>osmosisai</span>&nbsp;<span>rt</span>
            </Flex>
        )
    }

    get account(){
        const { collapsed } = this.state;
        let onClick = this.handleOnNavigateClick;
        let label = AppStore.account || 'Account';
        let selected = this.isCurrentPath(BrowserRoutes.account);
        let icon = (color:string) => <Icon.User color={color} size={18}/>;
        let accountArgs = {onClick, label, selected, icon, collapsed};

        return <NavButton {...accountArgs as any}/>
    }

    get collapse(){
        const { collapsed } = this.state;
        let onClick = this.onCollapseClick;
        let label = 'Collapse';
        let icon = (color:string) => <Icon.ChevronLeft color={color} size={18}/>;
        if (collapsed) icon = (color:string) => <Icon.ChevronRight color={color} size={18}/>;
        let accountArgs = {onClick, label, icon, collapsed};

        return <NavButton {...accountArgs as any}/>
    }

    render(){
        const { collapsed } = this.state;
        return(
            <section className={cx('header-component', {full:!collapsed})}>
                {this.company}
                <div className='navigation'>
                    {this.navItems}
                </div>
                <div className='bottom'>
                    {this.account}
                    {this.collapse}
                </div>
            </section>

        )
    }
}

export default withRouter(Header);
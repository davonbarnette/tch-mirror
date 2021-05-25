import React, { Component } from 'react';
import './styles.scss'
import * as Icon from 'react-feather';

interface DrawerProps{
    exitModalFn:()=>void,
    title:string,
}

export default class Drawer extends Component<DrawerProps, any> {

    render() {
        const { children, exitModalFn, title } = this.props;

        return (
            <div className='drawer-wrapper'>
                <div className='drawer-content'>
                    <div className='drawer-header-container'>
                        <div className='title'>{title}</div>
                        <Icon.X size={24} color='white' className='icon' onClick={exitModalFn}/>
                    </div>
                    {children}
                </div>
                <div className='backdrop' onClick={exitModalFn}/>
            </div>
        )
    }

}
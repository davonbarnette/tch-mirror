import React, {Component} from 'react';
import cx from 'classnames';
import {AlignItemsProperty, FlexDirectionProperty, JustifyContentProperty} from "csstype";
import './styles.scss';

interface FlexProps {
    flexDirection?:FlexDirectionProperty|undefined,
    justifyContent?:JustifyContentProperty|undefined,
    alignItems?:AlignItemsProperty|undefined,
    className?:string|undefined,
}

export class Flex extends Component<FlexProps, any> {

    render(){
        const {flexDirection, justifyContent, alignItems, className} = this.props;

        return(
            <div className={cx('flex-container', className || '')} style={{flexDirection, justifyContent, alignItems}}>
                {this.props.children}
            </div>
        )
    }
}

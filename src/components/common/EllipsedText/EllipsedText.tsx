import React, {Component, CSSProperties} from 'react';
import cx from 'classnames';
import './styles.scss'
import {Tooltip} from "antd";

interface EllipsedTextProps {
    text:string,
    style?:CSSProperties;
    className?:string,
}

export default class EllipsedText extends Component<EllipsedTextProps, any> {

    render(){
        const { style, className, text } = this.props;

        return(
            <div className={cx('ellipsed-text', className || '')} style={style}>
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            </div>
        )
    }

}
import React, {Component} from 'react';
import cx from 'classnames';
import './styles.scss';

export interface IndeterminateLoaderProps {
    className?:string,
}

export const IndeterminateLoader = (props:IndeterminateLoaderProps) => {
    const {className} = props;
    return (
        <div className={cx('progress', className || '')}>
            <div className="indeterminate"></div>
        </div>
    )
};
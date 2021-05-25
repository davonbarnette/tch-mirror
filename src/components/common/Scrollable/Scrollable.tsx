import React, {Component} from 'react';
import cx from 'classnames';
import './styles.scss';

interface ScrollableProps {
    scrollX?:boolean,
    scrollY?:boolean,
    className?:string|undefined
}

export class Scrollable extends Component<ScrollableProps, any> {

    render(){
        const { className, scrollX, scrollY } = this.props;
        return(
            <div className={cx('scrollable-container', className || '', {'scroll-x':scrollX, 'scroll-y':scrollY})}>
                {this.props.children}
            </div>
        )
    }
}

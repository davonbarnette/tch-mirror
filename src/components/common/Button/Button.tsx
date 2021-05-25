import React, {Component, CSSProperties} from 'react';
import cx from 'classnames';
import './styles.scss'

interface ButtonProps {
    enabled:boolean,
    onClick:(e?:React.MouseEvent)=>void,
    style?:CSSProperties;
    className?:string,
}

export default class Button extends Component<ButtonProps, any> {

    onButtonClick = (e:React.MouseEvent) => {
        const { enabled, onClick } = this.props;
        if (!enabled) return null;
        else onClick(e);
    };

    render(){
        const { enabled, children, style, className } = this.props;

        return(
            <div className={cx('button', className || '', {enabled, disabled:!enabled})} onClick={this.onButtonClick} style={style}>
                {children}
            </div>
        )
    }

}
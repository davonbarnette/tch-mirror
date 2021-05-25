import React, {Component} from 'react';
import './styles.scss';
import {Flex} from "../Flex/Flex";

interface StaticFieldProps {
    label?:string,
    className?:string,
}

interface StaticFieldState {

}

export default class StaticField extends Component<StaticFieldProps, StaticFieldState> {

    render(){
        const { className, label, children} = this.props;
        return(
            <div className={`static-field-container ${className || ''}`}>
                {label && <Flex className='static-field-label' flexDirection='row'>{label}</Flex>}
                {children}
            </div>
        )
    }
}
import React, {Component} from 'react';
import {observer} from "mobx-react";

import './styles.scss'

interface H2Props {
    header:any,
    subheader:any,
    className?:string
}

class H2 extends Component<H2Props, any> {
    render(){
        const { header, subheader, className } = this.props;

        return(
            <section className={`h2-section + ${className || ''}`}>
                <h2 className='header'>{header}</h2>
                <span className='subheader'>{subheader}</span>
            </section>
        )
    }
}

export default observer(H2);
import React, {Component} from 'react';
import './styles.scss';
import {observer} from "mobx-react";
import cx from 'classnames';

interface ResponsiveVideoProps{
    frame?:string,
    className?:string,
    videoContainerClassName?:string,
}


@observer
class ResponsiveVideo extends Component<ResponsiveVideoProps, any> {

    render() {

        const { className, videoContainerClassName, frame, children } = this.props;

        return (
            <div className={cx('responsive-video ', className || '')}>
                <div className={cx('video-container ', videoContainerClassName  || '')}>
                    {/*<img className='image' src={frame}/>*/}
                    {children}
                </div>
            </div>
        )
    }
}

export default ResponsiveVideo;


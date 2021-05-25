import React, {Component} from 'react';
import cx from 'classnames';

import './styles.scss';

interface AvatarProps {
    src?:string,
    className?:string,
    size:number,
    borderRadius?:number|string,
}

class Avatar extends Component<AvatarProps, any> {

    get backgroundImage(){
        const { src } = this.props;
        if (src) return `url(${src})`
    }
    render() {
        const { size, borderRadius, className } = this.props;
        return (
            <div className={cx('avatar', className || '')} style={{width:size, height:size, borderRadius, backgroundImage:this.backgroundImage }}>
            </div>
        )
    }
}

export default Avatar;
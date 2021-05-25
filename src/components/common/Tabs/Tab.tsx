import React, {Component} from "react";
import cx from 'classnames';

interface TabProps {
    onClick:(e:MouseEvent)=>void,
    label:string,
    selected:boolean|undefined,
    icon?:any,
}

export default class Tab extends Component<TabProps, any> {

    render() {
        const {onClick, label, selected, icon} = this.props;
        let color = selected ? '#ff2d55' : '#cccccc';

        let className = cx('tab', {selected});
        let containerArgs = {className, onClick};

        return (
            <span {...containerArgs as any}>
                {icon ? icon(color) : null}
                <div className='text'>{label}</div>
            </span>
        )
    }
}
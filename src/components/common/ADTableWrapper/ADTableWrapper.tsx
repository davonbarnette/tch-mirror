import React, {Component, ReactNode} from 'react';
import {Table, Empty, Icon, Button, ConfigProvider} from 'antd';
import {TableProps} from "antd/lib/table";

import './styles.scss';

interface ADTableWrapperProps extends TableProps<any> {
    noDataDescription:string|ReactNode;
}

export default class ADTableWrapper extends Component<ADTableWrapperProps, any> {

    getRowClassName = (record:any, index:number) => {
        return 'ad-table-row'
    };

    render(){

        const {noDataDescription } = this.props;

        return (
            <ConfigProvider renderEmpty={()=><Empty description={<span className='no-data-description'>{noDataDescription}</span>}/>}>
                <Table rowClassName={this.getRowClassName} pagination={false} {...this.props}/>
            </ConfigProvider>
        )

    }
}
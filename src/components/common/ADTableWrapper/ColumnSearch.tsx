import React from 'react';
import Button from "../Button/Button";
import {Input, Icon} from "antd";

import './styles.scss';

const handleSearch = (selectedKeys: string[], confirm: () => void, onConfirm:(dataIndex:string, selectedKeys:string[])=>void, dataIndex:string) => {
    confirm();
    onConfirm(dataIndex, selectedKeys);
};

const handleReset = (clearFilters: () => void, onReset:(dataIndex:string)=>void, dataIndex:string) => {
    clearFilters();
    onReset(dataIndex);
};

export const getColumnSearchProps = (dataIndex: string, onConfirm:(dataIndex:string, selectedKeys:string[])=>void, onReset:(dataIndex:string)=>void) => ({
    filterDropdown: (props: any) => {
        const {setSelectedKeys, selectedKeys, confirm, clearFilters} = props;
        return (
            <div className='search-column-container'>
                <Input
                    className='input'
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, onConfirm, dataIndex)}
                    size='large'
                />
                <div className='buttons-container'>
                    <Button className='search-action-button' enabled
                            onClick={() => handleSearch(selectedKeys, confirm, onConfirm, dataIndex)}>SEARCH</Button>
                    <Button className='search-action-button white' enabled
                            onClick={() => handleReset(clearFilters, onReset, dataIndex)}>RESET</Button>
                </div>
            </div>
        )
    },
    filterIcon: (filtered: boolean) => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
});
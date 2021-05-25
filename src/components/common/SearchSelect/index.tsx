import React, { Component } from 'react';
import {Select} from 'antd';

interface SearchSelectProps {
    className?:string,
    style?:any,

    //This must be a unique key across all pages that can be identified by a specific select form
    searchKey:string,
    onChange:(selectedOptions:any)=>void;
}

interface SearchSelectState {
    value:any[]
}

export default class SearchSelect extends Component<SearchSelectProps, SearchSelectState> {

    handleOnSearchCreatableChange(selectedOptions:any){
        this.props.onChange(selectedOptions);
        this.setState({value: selectedOptions})
    }

    render() {
        const { className, style } = this.props;

        return (
            <Select style={style}
                        className={className || ''}
                        allowClear
                        size='large'
                        dropdownStyle={{display:'none'}}
                        placeholder='Search and press Enter...'
                        mode='tags'
                        onChange={(selectedOptions)=>this.handleOnSearchCreatableChange(selectedOptions)}>
                </Select>
        )
    }

}
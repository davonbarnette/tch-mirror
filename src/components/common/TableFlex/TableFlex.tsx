import * as React from 'react';
import cx from 'classnames';
import './styles.scss';
import {TableComponentRowData, TableHeaderData} from "./types";
import * as Icon from 'react-feather';
import Logs from "../../../global/managers/Logs";
import EllipsedText from "../EllipsedText/EllipsedText";

class EmptyDataField extends React.Component<any,any>{

    render(){
        return(
            <div className='no-entries-container'>
                <Icon.Database color='#505050'/>
                <div className='text'>
                    No Entries
                </div>
            </div>
        )
    }

}

interface TableFlexProps {
    headers?:TableHeaderData[],
    data:any[],
    accentuateFirstColumn?:boolean,
    onRowClick?:(rowId:number|string)=>any,
    className?:string,
}

export default class TableFlex extends React.Component<TableFlexProps, any> {

    handleOnHeaderClick(header:string){
        //Sort by the header clicked
        Logs.component('sort by header: ', header);
    }

    getFlexedColumnWidthPercentage(numColumns:number, firstColumn = false):number{
        //Use this method to get the flex: 1 1 {}% property
        //Returns a whole number (0-100)
        const {accentuateFirstColumn } = this.props;

        let equallySeparatedColumnWidth = 100 / numColumns;

        if (accentuateFirstColumn){
            let newFirstColumnWidthPercentage = equallySeparatedColumnWidth * 2;

            //Accentuated first columns get twice the width they'd normally get
            if (firstColumn) return newFirstColumnWidthPercentage;

            //If we're on a column other than the first, we take the new firstColumn width, subtract it from the
            //total and then divide the rest of the space between the remaining columns
            else if (numColumns === 2) return 30;
            else return (100 - newFirstColumnWidthPercentage) / (numColumns - 1);
        }

        return 100 / numColumns;
    }

    get headers(){
        const { headers, accentuateFirstColumn } = this.props;
        if (!headers) return null;

        return headers.map((header, index) => (
            <div className={cx('header-item', {main:index === 0 && accentuateFirstColumn})}
                 style={{flex: `1 1 ${this.getFlexedColumnWidthPercentage(headers.length,index === 0)}%`}}
                 key={index}>{header.text}</div>
        ))
    }

    get rows(){
        const { onRowClick, data } = this.props;
        if (!data || data.length === 0) return <EmptyDataField/>;

        let rows = data.map((row:TableComponentRowData, index:number) => {

            let onClick = onRowClick ? ()=> onRowClick(row.id) : undefined;

            return (
                <div className={cx('data-row', {selectable: !!onRowClick})}
                     key={index}
                     onClick={onClick}>
                    {this.renderDataRowItems(row.data)}
                </div>
            )
        });
        return <div className='data-rows-container'>{rows}</div>
    }

    renderDataRowItems(data:any[]) {
        return data.map((dataItem, index) => (
            <div className='data-item'
                 key={index}
                 style={{flex: `0 1 ${this.getFlexedColumnWidthPercentage(data.length,index === 0)}%`}}>
                {dataItem}
            </div>
        ));

    }

    render() {
        const { className } = this.props;
        return (
            <div className={cx('table-flex', className || '')}>
                <div className='header-row'>{this.headers}</div>
                <div className='data-rows-outer'>{this.rows}</div>
            </div>
        )
    }
}
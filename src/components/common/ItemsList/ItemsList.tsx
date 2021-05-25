import React, {Component} from 'react';
import {observer} from "mobx-react";

import './styles.scss';

import {Flex} from "../Flex/Flex";
import Button from "../Button/Button";
import {Scrollable} from "../Scrollable/Scrollable";
import SearchSelect from "../SearchSelect";
import {ItemsListItemType} from "./Types";

interface ItemsByGroup {
    [key:string]:ItemsListItemType[]
}

interface ItemsListProps {
    onAddClick?:()=>void,
    items?:ItemsListItemType[] | ItemsByGroup,
    itemName:string,
}

interface ItemsListState {
    termFilters:string[],
}

class ItemsList extends Component<ItemsListProps,ItemsListState> {

    constructor(props:ItemsListProps){
        super(props);
        this.state = {
            termFilters:[],
        }
    }

    onTermsChange = (termFilters:string[]) => {
        this.setState({termFilters});
    };

    get groupings(){
        const { items } = this.props;

        if (!items) return null;
        if (!Array.isArray(items)){
            return Object.keys(items).map((key:string) => {
                let grouping:ItemsListItemType[] = items[key];
                let mappedItems = this.getAllItems(grouping);
                return (
                    <div className='grouping' key={key}>
                        <div className='grouping-header'>{key}</div>
                        <div className='items-in-grouping'>{mappedItems}</div>
                    </div>
                );
            })
        }
        else return this.getAllItems(items);
    }

    getAllItems(items: ItemsListItemType[]){
        const {termFilters} = this.state;
        let toRender = items;
        if (termFilters.length !== 0) toRender = items.filter((item: ItemsListItemType) => {
            for (let i = 0; i < termFilters.length; i++) {
                const termFilter = termFilters[i];
                if (item.value.toLowerCase().indexOf(termFilter.toLowerCase()) !== -1) return true;
            }
            return false;
        });

        return toRender.map((item: ItemsListItemType) => {
            return item.component
        });
    }

    render() {
        const { onAddClick, itemName } = this.props;

        return (
            <div className='items-list'>
                <SearchSelect className='search-items' searchKey={`${itemName}-list-search`} onChange={this.onTermsChange}/>
                <Scrollable scrollY>
                    <Flex className='items' flexDirection='column' justifyContent='flex-start'>
                        {this.groupings}
                    </Flex>
                </Scrollable>
                {onAddClick && <div className='add-item'>
                    <Button onClick={onAddClick} enabled={true}>
                        CREATE {itemName.toUpperCase()}
                    </Button>
                </div>}
            </div>
        )
    }
}

export default observer(ItemsList);
import {getColumnSearchProps} from "./ColumnSearch";

export default class ADTableSerializer<T> {

    idKey:string; items:T[]; propMap:any; overrides:any;

    constructor(items:T[], key:string, propMap:any, overrides?:any){
        this.idKey = key;
        this.items = items;
        this.propMap = propMap;
        this.overrides = overrides;
    }

    data = () => {
        const {items, propMap, idKey, overrides} = this;
        if (!items || items.length === 0) return [];

        return items.map((item:T, index:number) => {
            let props = {key:(item as any)[idKey]};
            Object.keys(propMap).forEach((key: string) => {
                let prop = (item as any)[key];
                let override = (overrides as any)[key];
                if (override) prop = override(prop);
                (props as any)[key] = prop || '-';
            });
            return props;
        })
    };

    columns = (onSearch:(dataIndex:string, selectedKeys:string[])=>void, onReset:(dataIndex:string)=>void) => {
        const {propMap} = this;
        return Object.keys(propMap).map((key:string) => {
            let prop = (propMap as any)[key];
            if (prop.searchable) prop = {...prop, ...getColumnSearchProps(key, onSearch, onReset)};
            return {...prop, dataIndex:key};
        })
    }
}
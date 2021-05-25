export const FIXED_COMPONENT_TYPES = {
    MODAL:'modal',
    DRAWER:'drawer',
};

export const MODALS_BY_ID = {
    CREATE_HEARTBEAT:'CREATE_HEARTBEAT'
};

export const DRAWERS_BY_ID = {
    EXAMPLE_DRAWER:'EXAMPLE_DRAWER',
};

export interface SingleDataPropertyType {
    title:string,
    sorter:(a:any,b:any) => void,
    sortDirections:string[],
}

export interface WebSocketResponseType<T> {
    success:boolean,
    data:T,
    code:number,
}
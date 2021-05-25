export interface LineGraphData {
    [key:string]:SingleLineData
}

export interface SingleLineData {
    title:string,
    points:number[],
    strokeColor:string,
    strokeWidth?:number,
}

export interface SingleTab {
    label:string,
    onClick:(e:MouseEvent)=>void,
    icon?:(color:string) => JSX.Element
    selected?:boolean
}
import * as React from 'react';
import {observer} from "mobx-react";
import './styles.scss'
import { Popover } from 'antd';
import Button from "../Button/Button";

interface RowProps {
    xAxisLabels:{ onClick:()=>void, label:number }[]
    label:string,
    frequencies: number[],
}

@observer class Row extends React.Component<RowProps, any> {

    get squares(){
        const { label, frequencies, xAxisLabels} = this.props;
        return frequencies.map((frequency, index) => {
            let squareProps = { frequency, key:index, xAxisLabel: xAxisLabels[index], label };
            return <Square {...squareProps} />
        })
    }

    render(){
        const { label } = this.props;
        return (
            <div className='heat-row-container'>
                <div className='heat-row-label'>{label}</div>
                <div className='heat-row-squares'>{this.squares}</div>
            </div>
        )
    }
}

interface SquareProps {
    frequency:number,
    xAxisLabel: { onClick:()=>void, label:number }
    label:string,
}

@observer class Square extends React.Component<SquareProps, any> {

    constructor(props:SquareProps){
        super(props);
    }

    get color(){
        const { frequency } = this.props;
        let color = '#e6e6e6';
        if (frequency > 0) color = '#2d62ff40';
        if (frequency > 1) color = '#2d62ff7d';
        if (frequency > 2) color = '#2d62ffa8';
        if (frequency > 3) color = '#2d62ffd1';
        if (frequency > 4) color = '#2d62ff';

        return color;
    }

    render(){
        const { frequency, xAxisLabel, label } = this.props;
        let content = (
            <div className='popover-content'>
                <div className='content-paragraph'>{`${label} was recognized ${frequency} time${frequency === 1 ? "" : 's'}`}</div>
                <Button className='go-to-event' enabled onClick={xAxisLabel.onClick}>GO TO EVENT</Button>
            </div>
        );
        return(
            <Popover content={content}
                     title={xAxisLabel.label}
                     trigger={'hover'}>
                <div className='heat-square' style={{backgroundColor: this.color}}/>
            </Popover>
        )
    }
}

interface HeatmapProps {
    data:{ [key:string]:{ label:string, frequencies:number[] } }
    xAxisLabels:{ onClick:()=>void, label:number }[]
}

interface HeatmapState {}

@observer
export default class Heatmap extends React.Component<HeatmapProps, HeatmapState>{

    get rows(){
        const { data, xAxisLabels } = this.props;
        return Object.keys(data).map(key => {
            const {frequencies, label} = data[key];
            let rowProps = { frequencies, label, key, xAxisLabels };
            return <Row {...rowProps}/>
        })
    }


    render(){
        return(
            <div className='heatmap-component'>
                {this.rows}
            </div>
        )
    }

}

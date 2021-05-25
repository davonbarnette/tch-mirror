import React, { Component } from 'react';
import cx from 'classnames';

import './styles.scss';

import {LineGraphData, SingleLineData} from "./Types";


interface PixelCoordinates{
    top:number,
    left:number,
    index:number,
}

interface LineGraphComponentProps {
    className?:string,
    data:LineGraphData;
    labels?:any[];
    dataPointsArePercentages?:boolean;
    horizontalLineIncrements?:number,
    allowHoverVerticalLine?:boolean,
    onMousePositionChange?:(valuesByDataPointKey:any)=>void,
}

interface LineGraphComponentState {
    xWithValues:number[]
    curMouseCoordinate:PixelCoordinates|null,
    mouseInsideSVG:boolean|null,
    dotPositions:any[]|null,
}

export default class LineGraphComponent extends Component<LineGraphComponentProps, LineGraphComponentState> {

    state: LineGraphComponentState = {
        xWithValues:[],
        curMouseCoordinate:null,
        mouseInsideSVG:null,
        dotPositions:null,
    };

    constructor(props: LineGraphComponentProps) {
        super(props);
    }

    getPolyLinePoints(dataPoints:any){
        //PolyLines are drawn by points ("0,20 20,40") where the first number is the pixels from the left,
        //and the second number is the pixels from the top

        let polylinePoints = '';
        let numPoints = dataPoints.length;

        this.getPixelCoordinates(dataPoints, (pixelCoordinates, i)=>{
            polylinePoints += `${pixelCoordinates.left}, ${pixelCoordinates.top}`;
            if (i !== numPoints - 1) polylinePoints += ' ';
        });

        return polylinePoints;
    }

    handleOnMouseEnter(){
        if (!this.props.allowHoverVerticalLine) return;
        this.setState({mouseInsideSVG:true});
    }

    handleOnMouseLeave(){
        if (!this.props.allowHoverVerticalLine) return;
        this.setState({mouseInsideSVG:false, curMouseCoordinate:null});
    }

    getPixelCoordinates(dataPoints:number[], forEach?:(pixelCoordinates:PixelCoordinates, index:number)=>void):PixelCoordinates[]{
        let numPoints = dataPoints.length;
        let incrementBy = 100 / (numPoints - 1);
        let highestDataPoint = Math.max(...dataPoints);

        return dataPoints.map((curDataPoint, i)=>{
            let curPercentage = this.props.dataPointsArePercentages ? curDataPoint : (curDataPoint / highestDataPoint) * 100;
            let top = 100 - curPercentage;
            let left = incrementBy * i;

            let pixelCoordinates:PixelCoordinates = {top, left, index:i};
            if (forEach) forEach(pixelCoordinates, i);

            return pixelCoordinates;
        });
    }

    handleOnMouseMove(e:React.MouseEvent<HTMLDivElement>){
        const { allowHoverVerticalLine, data, onMousePositionChange} = this.props;
        if (!allowHoverVerticalLine || !data) return;

        const { nativeEvent, currentTarget } = e;
        const { offsetX, offsetY } = nativeEvent;
        const { offsetWidth, offsetHeight } = currentTarget;

        let curXHoverPosition = (offsetX/offsetWidth) * 100;
        let curYHoverPosition = (offsetY/offsetHeight) * 100;

        let positionChangedXValues:any = {};

        for (let key in data){
            let singleField = data[key];
            let dataPoints = singleField.points;

            if (!dataPoints || dataPoints.length === 0) continue;

            let pixelCoordinates = this.getPixelCoordinates(dataPoints);

            let closestPixelCoordinate = pixelCoordinates.reduce(function(prev, curr) {
                return (Math.abs(curr.left - curXHoverPosition) < Math.abs(prev.left - curXHoverPosition) ? curr : prev);
            });

            closestPixelCoordinate.top = curYHoverPosition;
            positionChangedXValues[key] = dataPoints[closestPixelCoordinate.index];
            positionChangedXValues['index'] = closestPixelCoordinate.index;
            this.setState({curMouseCoordinate:closestPixelCoordinate})
        }

        if (onMousePositionChange) onMousePositionChange(positionChangedXValues);

    }

    get polylines(){
        const { data } = this.props;
        let ret = [];
        for (let key in data){
            let singleLine:SingleLineData = data[key];

            if (!singleLine.points || singleLine.points.length === 0) continue;

            ret.push(
                <polyline
                    fill="none" stroke={singleLine.strokeColor} strokeWidth="2" vectorEffect='non-scaling-stroke'
                    key={key} points={this.getPolyLinePoints(singleLine.points)} />,
                <polygon
                    fill={singleLine.strokeColor} opacity={0.5} stroke="none" strokeWidth="2" vectorEffect='non-scaling-stroke'
                    key={key + 'polygon'} points={`0,100 ${this.getPolyLinePoints(singleLine.points)} 100,100`}/>
            )
        }
        return ret;
    }

    get horizontalLines(){
        const { horizontalLineIncrements } = this.props;
        if (horizontalLineIncrements){
            let polylines = [];

            for (let i = horizontalLineIncrements; i < 100; i+=horizontalLineIncrements) {
                let pixelsFromTop = 100 - i;
                polylines.push(
                    <div key={i} className='horizontal-line-increment' style={{top:`${pixelsFromTop}%`}}>
                        <div className='text'>{i}%</div>
                        <div className='line'/>
                    </div>
                )
            }

            return polylines
        }
    }

    get verticalLine(){

        const {curMouseCoordinate} = this.state;
        const {allowHoverVerticalLine} = this.props;
        if (!curMouseCoordinate) return null;
        const {left, top} = curMouseCoordinate;

        if (!curMouseCoordinate || !allowHoverVerticalLine) return;
        let polyLinePointFromLeft = `${left},0 ${left}, 100`;
        let polyLinePointFromTop = `0,${top} 100,${top}`;
        let strokeColor = '#dadada';
        return [
            <polyline
                fill="none" key={'from-left'} stroke={strokeColor} strokeWidth="1" vectorEffect='non-scaling-stroke'
                points={polyLinePointFromLeft} />,
        ];
    }

    render() {
        const { className } = this.props;
        return (
            <div className={cx('line-graph-component', className || '')}
                 onMouseLeave={()=>this.handleOnMouseLeave()}
                 onMouseEnter={()=>this.handleOnMouseEnter()}
                 onMouseMove={(e)=>this.handleOnMouseMove(e)}>
                <svg viewBox="0 0 100 100" preserveAspectRatio='none' className='graph-container'>
                    {this.verticalLine}
                    {this.polylines}
                </svg>
                {this.horizontalLines}
            </div>
        )
    }

}
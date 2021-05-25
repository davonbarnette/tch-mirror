import React, { Component } from 'react';
import cx from 'classnames';
import {observer} from "mobx-react";
import * as Icon from 'react-feather';
import moment from 'moment';
import {Tooltip} from "antd";

import './styles.scss'

import ResponsiveVideo from "../ResponsiveVideo/ResponsiveVideo";
import {FrameDataType} from "./Types";


interface VideoPlayerProps {
    frames:FrameDataType[]
    clearVideo?:()=>void
    live?:boolean,
    enableTimeline?:boolean,
    onTimelineClick?:(index:number)=>void,
    onPauseLiveClick?:()=>void,
    onResumeLiveClick?:()=>void,
    liveModeEnabled?:boolean,
}

interface VideoPlayerState {
    showPlay:boolean,
    playing:boolean,
    frame:number,
    hoveredFrame:number|null,
    progressHovered:number,
    progressLoaded?:number,
    markerClicked:boolean,
    progressBarEntered:boolean,
}

class VideoPlayer extends Component<VideoPlayerProps, VideoPlayerState> {

    videoIntervalHandler:any;

    constructor(props:VideoPlayerProps){
        super(props);
    }

    state: VideoPlayerState = {
        frame:0,
        showPlay:false,
        playing:false,
        hoveredFrame:null,
        progressHovered:0,
        markerClicked:false,
        progressBarEntered: false,
    };


    componentWillReceiveProps(nextProps:VideoPlayerProps){
        if (this.state.playing) this.pauseVideo();
        // this.setState({frame:0});
    }
    onResumeLive = () => {
        const {live, onResumeLiveClick} = this.props;
        if (!live && onResumeLiveClick) onResumeLiveClick();
    };

    onTimelineMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
        const { frames } = this.props;
        const { markerClicked, progressBarEntered } = this.state;

        if (!progressBarEntered && !markerClicked) return null;

        e.preventDefault();

        let progressHovered = e.pageX - e.currentTarget.getBoundingClientRect().left - 12;
        let width = e.currentTarget.clientWidth - 24;

        let percentage = progressHovered / width;
        let hoveredFrame = Math.round(frames.length * percentage);

        let state:any = { ...this.state, progressHovered, hoveredFrame };

        if (markerClicked) state = { ...state, frame:hoveredFrame };

        this.setState(state);
    };
    onEnterProgressBar = (e:React.MouseEvent<HTMLDivElement>) => {
        this.setState({progressBarEntered:true});
    };
    onLeaveProgressBar = () => {
        this.setState({progressBarEntered:false, hoveredFrame:null, progressHovered: 0});
    };
    onLeaveTimeline = () => {
        const { markerClicked } = this.state;
        if (!markerClicked) {
            this.setState({progressHovered:0});
            this.setState({hoveredFrame:null});
        }
        this.setState({markerClicked:false});
    };
    onTimelineMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {
        const { frames, onTimelineClick } = this.props;
        const { markerClicked } = this.state;

        e.preventDefault();
        e.stopPropagation();

        let width = e.currentTarget.clientWidth;
        let curPosition = e.nativeEvent.offsetX;

        let percentage = curPosition / width;
        let frame = Math.round(frames.length * percentage);

        this.setState({ frame, markerClicked:true });
        if (onTimelineClick) onTimelineClick(frame);

    };
    onTimelineMouseUp = () => {
        this.setState({markerClicked:false});
    };
    onMarkerMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({markerClicked:true});
    };
    onMarkerMouseUp = () => {
        this.setState({markerClicked:false})
    };
    onMouseEnterVideo = () => {
        this.setState({showPlay:true})
    };
    onMouseLeaveVideo = () => {
        this.setState({showPlay:false})
    };

    get frameData(){
        const { frames, live } = this.props;
        const { frame } = this.state;
        if (!frames) return null;
        if (!frame || live) return frames[frames.length - 1];
        else return frames[frame];
    }
    get hoveredFrameData(){
        const { frames } = this.props;
        const { hoveredFrame } = this.state;
        if (!frames || !hoveredFrame) return null;
        return frames[hoveredFrame];
    }

    get image(){
        if (!this.frameData) return null;
        return this.frameData.url;
    }
    get curTime(){
        if (!this.frameData) return null;
        return moment(this.frameData.timestamp).format('hh:mm:ss');
    }

    goToNextFrame = (e?:React.MouseEvent<HTMLOrSVGElement>) => {

        if (e){
            e.stopPropagation();
            e.preventDefault();
        }

        const { frames } = this.props;
        const { frame } = this.state;

        let lastFrame = frames.length - 1;
        let nextFrame = frame + 1;

        if (lastFrame === frame){
            nextFrame = 0;
            if (this.videoIntervalHandler) return this.pauseVideo();
        }
        this.setState({frame:nextFrame})
    };

    goToPreviousFrame = (e?:React.MouseEvent<HTMLOrSVGElement>) => {
        if (e){
            e.stopPropagation();
            e.preventDefault();
        }
        const { frame } = this.state;
        let previousFrame = frame - 1;
        if (previousFrame < 0) return null;
        this.setState({frame:previousFrame});
    };

    playVideo(){
        const { frames } = this.props;
        let lastFrame = frames.length - 1;
        if (lastFrame) this.setState({frame:0});

        this.goToNextFrame();
        this.videoIntervalHandler = setInterval(this.goToNextFrame,1000);

        this.setState({playing:true});
    }
    pauseVideo(){
        clearInterval(this.videoIntervalHandler);
        this.setState({playing:false});
    }
    toggleVideoPlayState = (e?:(React.MouseEvent<HTMLDivElement>)|(React.MouseEvent<SVGElement>)) => {
        const {live, onPauseLiveClick} = this.props;
        const {playing, markerClicked} = this.state;
        if (live && onPauseLiveClick) onPauseLiveClick();
        if (playing) this.pauseVideo();
        else if (!markerClicked) this.playVideo();
        if (e) e.stopPropagation();
    };
    onVideoKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
        const {key} = e;
        switch(key){
            case "ArrowRight":
                this.goToNextFrame();
                break;
            case "ArrowLeft":
                this.goToPreviousFrame();
                break;
            case " ":
                this.toggleVideoPlayState();
                break;
        }

    };
    get current() {
        const {frame} = this.state;
        const {frames, live} = this.props;
        if (live) return '100%';
        return `${(frame / frames.length) * 100}%`;

    }
    get time(){
        const { enableTimeline, live, frames } = this.props;
        if (!enableTimeline) return null;
        let timeDisplay:any = 'LIVE';
        if (!live) {
            if (!this.frameData) timeDisplay = '00:00:00';
            else {
                // let lastFrameTime = moment(frames[frames.length - 1].timestamp);
                // let curTime = moment(this.frameData.timestamp);
                // let diff = moment.duration(lastFrameTime.diff(curTime));
                // timeDisplay = `-${this.prependZero(diff.hours())}:${this.prependZero(diff.minutes())}:${this.prependZero(diff.seconds())}`;
                timeDisplay = moment(this.frameData.timestamp).format('hh:mm:ss A')
            }
        }
        return timeDisplay;
    }
    get playButton(){
        const {live} = this.props;
        const {playing} = this.state;
        if (live) return <Tooltip title='Pause (Space)'>
            <Icon.Pause onClick={this.toggleVideoPlayState} className='controller-button' size={16}/>
        </Tooltip>;

        if (playing) return <Tooltip title='Pause (Space)'><Icon.Pause onClick={this.toggleVideoPlayState} className='controller-button' size={16}/></Tooltip>;
        return <Tooltip title='Play (Space)'><Icon.Play onClick={this.toggleVideoPlayState} className='controller-button' size={16}/></Tooltip>;
    }
    get liveButton() {
        const {live, liveModeEnabled} = this.props;
        if (!live && liveModeEnabled) return (
            <Tooltip title='Back to Live'>
                <Icon.Activity className='controller-button' onClick={this.onResumeLive} size={18}/>
            </Tooltip>
        )
    }

    clearVideo(){
        if (this.props.clearVideo) this.props.clearVideo();
    }

    render() {
        const {progressHovered} = this.state;
        return (
            <div className='video-player-container'>
                <div className='video-player' tabIndex={0} onMouseDown={this.toggleVideoPlayState} onKeyDown={this.onVideoKeyDown}
                     onMouseEnter={() => this.onMouseEnterVideo()} onMouseLeave={() => this.onMouseLeaveVideo()}>
                        <ResponsiveVideo frame={this.image || ''} className='current-frame' videoContainerClassName='custom-video-container'>
                            <div className='timeline-container' onMouseLeave={this.onLeaveTimeline} onMouseUp={this.onTimelineMouseUp} onMouseMove={this.onTimelineMouseMove}>
                                <div className='progress-bar'
                                     onMouseDown={this.onTimelineMouseDown}
                                     onMouseUp={this.onTimelineMouseUp}

                                     onMouseLeave={this.onLeaveProgressBar}
                                     onMouseEnter={this.onEnterProgressBar}>

                                    <div className='progress-bar-hovered' style={{width:progressHovered}}>
                                        <div className='preview' style={{display: progressHovered ? 'flex' : 'none'}}>
                                            <ResponsiveVideo className='current-frame'
                                                             videoContainerClassName='custom-video-container'
                                                             frame={this.hoveredFrameData ? this.hoveredFrameData.url : undefined}/>
                                            <div
                                                className='preview-timestamp'>{moment(this.hoveredFrameData ? this.hoveredFrameData.timestamp : undefined).format('hh:mm:ss A')}</div>
                                        </div>
                                    </div>
                                    <div className='progress-bar-current' style={{width:this.current}}/>
                                    <div className='progress-bar-marker' onMouseDown={this.onMarkerMouseDown}
                                         onMouseUp={this.onMarkerMouseUp} style={{left:this.current}}/>

                                </div>
                                <div className='controls'>
                                    <div className='left'>
                                        {this.playButton}
                                        <Tooltip title='Previous Frame (Arrow Left)'>
                                            <Icon.Rewind className='controller-button' onClick={this.goToPreviousFrame} size={18}/>
                                        </Tooltip>
                                        <Tooltip title='Next Frame (Arrow Right)'>
                                            <Icon.FastForward className='controller-button' onClick={this.goToNextFrame} size={18}/>
                                        </Tooltip>
                                        {this.liveButton}
                                    </div>
                                    <div className='right'>
                                        <div className='time'>
                                            <div className='text'>{this.time}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ResponsiveVideo>
                    </div>
            </div>
        )
    }
}

export default observer(VideoPlayer)
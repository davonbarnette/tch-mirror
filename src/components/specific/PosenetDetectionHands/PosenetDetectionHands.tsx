import React, {Component} from 'react';
import cx from 'classnames';
import * as Icon from 'react-feather';

import './styles.scss';

import ResponsiveVideo from "../../common/ResponsiveVideo/ResponsiveVideo";
import PosenetHelperClass, {
    PosenetDetectionPoint,
    PosenetPoint,
    PosenetPose
} from "../../../global/managers/PosenetHelper";

interface PosenetDetectionHandsProps {
    className?: string,
    model: any,
    src: string,
    onToggle: () => void
}

interface PosenetDetectionHandsState {
    poses: PosenetPose[];
    srcLoaded: boolean,
    nvidia:PosenetPoint,
    nvidiaShow:boolean,
    dell:PosenetPoint,
    dellShow:boolean,
    wristsAboveEyes:boolean,
    numAboveHead:number,
}

export class PosenetDetectionHands extends Component<PosenetDetectionHandsProps, PosenetDetectionHandsState> {

    srcRef: any;

    state: PosenetDetectionHandsState = {
        poses: [],
        srcLoaded: false,
        nvidia:{x:0, y:0},
        dell:{x:0, y:0},
        nvidiaShow:false,
        dellShow:false,
        wristsAboveEyes:false,
        numAboveHead:0,
    };

    constructor(props: PosenetDetectionHandsProps) {
        super(props);
        this.srcRef = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<PosenetDetectionHandsProps>, prevState: Readonly<PosenetDetectionHandsState>, snapshot?: any): void {
        const {src} = this.props;
        if (src === prevProps.src) return;
        this.srcRef.current.srcObject = src
    }

    onSrcReady = async (req:boolean = false) => {
        const {model, src} = this.props;
        const {current} = this.srcRef;
        if (!current) return;
        let poses = await model.estimateMultiplePoses(current);
        if (!!src) requestAnimationFrame(()=>this.onSrcReady(true));

        let pose = poses[0];
        if (!pose) return null;

        const {keypoints} = pose;

        const PosenetHelper = new PosenetHelperClass(keypoints);

        let rightWrist = PosenetHelper.getPoint('rightWrist');
        let rightEye = PosenetHelper.getPoint('rightEye');

        let leftWrist = PosenetHelper.getPoint('leftWrist');
        let leftEye = PosenetHelper.getPoint('leftEye');

        let distanceBetweenLeftEyeAndWrist = PosenetHelper.distanceBetween(leftEye, leftWrist);
        let distanceBetweenRightEyeAndWrist = PosenetHelper.distanceBetween(rightEye, rightWrist);

        // If distance is positive, it means the wrists are above the eyes

        if (distanceBetweenLeftEyeAndWrist && distanceBetweenRightEyeAndWrist) {
            const {wristsAboveEyes, numAboveHead} = this.state;
            const {distanceY: rightY} = distanceBetweenRightEyeAndWrist;
            const {distanceY: leftY} = distanceBetweenLeftEyeAndWrist;
            if (leftY > 0 && rightY > 0) {
                if (!wristsAboveEyes) this.setState({wristsAboveEyes:true, numAboveHead:numAboveHead+1})
            }
            else this.setState({wristsAboveEyes: false});
        }

        if (!req) this.setState({srcLoaded: true, poses});
        else this.setState({poses});
    };

    get points() {
        const {poses} = this.state;
        return poses.map((pose: PosenetPose) => {
            return pose.keypoints.map((point: PosenetDetectionPoint, index: number) =>
                <Point key={index} point={point} index={index}/>)
        })
    }

    get action() {
        const {src} = this.props;
        if (src) return <Icon.Pause className='icon' color='white' size={36}/>;
        else return <Icon.Play className='icon' color='white' size={36}/>;
    }

    onClickVideo = () => {
        const {onToggle} = this.props;
        if (onToggle) onToggle();
    };

    render() {
        const {className, src} = this.props;
        const {numAboveHead} = this.state;

        return (
            <div className={cx('detection-container-hands', className || '')}>
                <div className='details'>
                    <div className='num-hands'>Counter: {numAboveHead}</div>
                    <div className='instructions'>
                        Press play on the video, the counter should increment each time you put your hands above your head.
                    </div>
                </div>
                <div className='video-container'>
                    <div className='video-player' tabIndex={0}  onClick={this.onClickVideo}>
                        <ResponsiveVideo className='current-frame' videoContainerClassName='custom-video-container'>
                            <video className={cx('posenet-video', {play: !!src})} width={640} height={360}
                                   ref={this.srcRef} onLoadedData={this.onSrcReady as any} autoPlay/>
                            {this.action}
                        </ResponsiveVideo>
                    </div>
                </div>
            </div>
        )
    }
}

interface PointProps {
    point: PosenetDetectionPoint,
    index: number,
}

const Point = (props: PointProps) => {
    const {point, index} = props;
    const {x, y} = point.position;
    if (point.score > 0.5) return <div key={index} className={cx('point')} style={{left: x, top: y}}/>;
    else return null;
};

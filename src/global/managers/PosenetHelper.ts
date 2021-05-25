import {Pose} from "@tensorflow-models/posenet";

export interface PosenetPoint {
    // Always relative to frame
    x:number,
    y:number,
}

export interface PosenetDetectionPoint {
    part: string,
    score: number,
    position: PosenetPoint
}

export interface PosenetPose {
    score: number,
    keypoints: PosenetDetectionPoint[],
}

export interface PosenetDistanceBetween {
    distanceX:number,
    distanceY:number,
}

export default class PosenetHelperClass {

    keypoints:PosenetDetectionPoint[];

    constructor(keypoints:any){
        this.keypoints = keypoints;
    }

    getKeypointIndex(name:string){
        return builtKeypointsByIndex[name];
    }

    getPoint(name:string){
        return this.keypoints[this.getKeypointIndex(name)];
    }

    distanceBetween(startPoint:PosenetDetectionPoint, endPoint:PosenetDetectionPoint, threshold = 0.4){
        if (!this.scoresAreAboveThreshold([startPoint.score, endPoint.score], threshold)) return null;

        let distanceX = startPoint.position.x - endPoint.position.x;
        let distanceY = startPoint.position.y - endPoint.position.y;

        return {distanceX, distanceY};
    }

    scoresAreAboveThreshold(scores:any[], threshold:number){
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            if (score < threshold) return false;
        }
        return true;
    }

    getAngle(startPoint:PosenetDetectionPoint, rotationalPoint:PosenetDetectionPoint, endPoint:PosenetDetectionPoint, threshold = 0.6){
        //Angle relative to start point to rotational point
        //Rotate entire piece, and assume x is parallel to frame

        if (!this.scoresAreAboveThreshold([startPoint.score, rotationalPoint.score, endPoint.score], threshold))
            return null;

        let startPosition = startPoint.position;
        let rotationalPosition = rotationalPoint.position;
        let endPosition = endPoint.position;

        let height = Math.abs(startPosition.y - endPosition.y);
        let width = Math.abs(endPosition.x - rotationalPosition.x);

        return Math.atan(height / width) * (180 / Math.PI);
    }
}

const POSENET_KEYPOINTS_BY_INDEX = [
    'nose',
    'leftEye',
    'rightEye',
    'leftEar',
    'rightEar',
    'leftShoulder',
    'rightShoulder',
    'leftElbow',
    'rightElbow',
    'leftWrist',
    'rightWrist',
    'leftHip',
    'rightHip',
    'leftKnee',
    'rightKnee',
    'leftAnkle',
    'rightAnkle',
];

function buildKeypointsByIndex(){
    let ret:any = {};
    POSENET_KEYPOINTS_BY_INDEX.forEach((keypoint:string, i:number) => ret[keypoint] = i);
    return ret;
}

export const builtKeypointsByIndex = buildKeypointsByIndex();
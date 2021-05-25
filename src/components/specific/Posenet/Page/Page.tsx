import React, {Component} from 'react';
import {observer} from "mobx-react";
import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import * as cocoSsd from '@tensorflow-models/coco-ssd';

import './styles.scss';

import {Redirect, Route, Switch} from "react-router";
import TCHLogo from '../../../../assets/images/tch-logo.png'
import {PosenetDetectionHands} from "../../PosenetDetectionHands/PosenetDetectionHands";
import {BrowserRoutes} from "../../../../data/Routers/BrowserRouter";

interface PosenetPageProps {

}

interface PosenetPageState {
    posenetModel: any,
    cocoModel: any,
    src: any,
}

class PosenetPage extends Component<PosenetPageProps, PosenetPageState> {

    state: PosenetPageState = {
        posenetModel: null,
        cocoModel: null,
        src: null,
    };

    constructor(props: PosenetPageProps) {
        super(props);

    }

    async componentDidMount() {
        let posenetModel = await posenet.load();
        let cocoModel = await cocoSsd.load();
        this.setState({posenetModel, cocoModel});
    }

    onToggle = async () => {
        let {src} = this.state;
        if (!src) {
            let curSrc = await navigator.mediaDevices.getUserMedia({
                video: {width: {ideal: 1920}, height: {ideal: 1080}}
            });
            if (curSrc) this.setState({src: curSrc})
        } else this.setState({src: null})
    };

    get content() {
        const {src, posenetModel, cocoModel} = this.state;
        if (posenetModel && cocoModel) return (
            <Switch>
                <Route path={BrowserRoutes.home}
                       render={() => <PosenetDetectionHands onToggle={this.onToggle} model={posenetModel} src={src}/>}/>
                <Redirect to={BrowserRoutes.home}/>
            </Switch>
        );
        else return (
            <div className='logo-spin-container'>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"/>
                    <div className="sk-cube2 sk-cube"/>
                    <div className="sk-cube4 sk-cube"/>
                    <div className="sk-cube3 sk-cube"/>
                </div>
                <div className='text'>
                    Loading Model...
                </div>
            </div>
        )
    }

    render() {
        return (
            <section className='posenet-page'>
                {this.content}
            </section>
        )
    }
}

export default observer(PosenetPage);
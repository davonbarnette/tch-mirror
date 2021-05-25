import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';
import * as Icon from 'react-feather';
import './styles.scss';
import {Flex} from "../Flex/Flex";

interface CustomDropzoneProps {
    className?: string,
    onDrop: (files: any[]) => void
}


export default class CustomDropzone extends Component<CustomDropzoneProps, any> {

    onDrop = (files:any[]) => {
        const {onDrop} = this.props;
        onDrop(files);
    };

    renderContent(isDragReject:boolean) {

        const { children } = this.props;

        if (children) return children;
        if (isDragReject) return (
            <Flex justifyContent='center' alignItems='center'>
                <Icon.Slash color='#e9e9e9' size={24} style={{marginRight:12}}/>
                <div className='dropzone-text'>Found an Unsupported File Type</div>
            </Flex>

        );
        else return (
            <Flex justifyContent='center' alignItems='center'>
                <Icon.UploadCloud color='#e9e9e9' size={24} style={{marginRight:12}}/>
                <div className='dropzone-text'>Drag & Drop or Click to Upload</div>
            </Flex>
        );
    }


    render(){
        const { className } = this.props;

        return(
            <Dropzone accept="image/jpeg" onDrop={this.onDrop}>
                {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles}) => {
                    let customClassName = cx('custom-dropzone', className || '',
                        { 'drag-accept':isDragAccept, 'drag-reject':isDragReject }
                    );

                    return (
                        <div {...getRootProps()} className={customClassName}>
                            <input {...getInputProps()} />
                            {this.renderContent(isDragReject)}
                        </div>
                    )
                }}
            </Dropzone>
        )
    }
}
import React, {Component} from 'react';
import { Input } from 'antd';
import './styles.scss';
import {ValidationObject} from "../../../global/managers/Validator";
import {Flex} from "../Flex/Flex";

const TextArea = Input.TextArea;

interface FieldProps {
    validation?:(value:string) => ValidationObject
    type?:'text'|'textarea'|'select'
    defaultValue?:string
    placeholder?:string,
    label?:string,
    id:string,
    className?:string,
    onChange:(label:string, value:string, validationObject:ValidationObject|null) => void
    required?:boolean
}

interface FieldState {
    value:string,
    error:string|null,
}

export default class Field extends Component<FieldProps, FieldState> {

    state:FieldState = {
        value:'',
        error:null,
    };

    constructor(props:FieldProps){
        super(props);
        const {defaultValue} = props;
        if (defaultValue) this.state.value = defaultValue;
    }

    onInputChange = (e:(React.ChangeEvent<HTMLInputElement>)|(React.ChangeEvent<HTMLTextAreaElement>)) => {
        const { onChange, id } = this.props;
        const { value } = e.target;
        let validationObject = this.validate(value);
        onChange(id, value, validationObject);
        this.setState({ value })
    };

    validate(value:string){
        const {validation} = this.props;
        if (validation) {
            let result = validation(value);
            const {error, isValid} = result;
            if (isValid) this.setState({error:null});
            else if (error) this.setState({ error });
            return result;
        }
        return null;
    }

    get input(){
        const { defaultValue, type } = this.props;
        if (type === 'textarea') return (
            <TextArea onChange={this.onInputChange}
                      style={{resize:'none'}}
                      autosize={{ minRows: 5, maxRows: 6 }}
                      defaultValue={defaultValue || ''}/>
        );
        else return (
            <Input onChange={this.onInputChange}
                   size='large'
                   defaultValue={defaultValue || ''}/>
        )
    }
    get required(){
        const {required} = this.props;
        if (required) return <div className='required'>*</div>
    }

    render(){
        const { error } = this.state;
        const { className, label } = this.props;
        return(
            <div className={`field-container ${className || ''}`}>
                {label && <Flex className='field-label' flexDirection='row'>{label}{this.required}</Flex>}
                {this.input}
                <div className='field-error' style={{opacity: error ? 1 : 0, height:12, transform:'translate(0)'}}>{this.state.error || ' '}</div>
            </div>
        )
    }
}
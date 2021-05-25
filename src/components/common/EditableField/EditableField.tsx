import React, {Component} from 'react';
import { Input } from 'antd';
import * as Icon from 'react-feather';
import './styles.scss';
import {Flex} from "../Flex/Flex";
import {ValidationObject} from "../../../global/managers/Validator";

interface EditableFieldProps {
    validation?:(value:string) => ValidationObject
    onClickSave:(value:string)=>void
    type?:'text'|'textarea'
    defaultValue?:string
    placeholder?:string,
    label?:string,
    className?:string
}

interface EditableFieldState {
    value:string,
    editing:boolean,
    error:string|null,
}

export default class EditableField extends Component<EditableFieldProps, EditableFieldState> {

    state:EditableFieldState = {
        value:'',
        editing:false,
        error:null,
    };

    constructor(props:EditableFieldProps){
        super(props);
        this.state.value = props.defaultValue || '';
    }

    onSaveClick = () => {
        const { onClickSave } = this.props;
        const { value } = this.state;
        if (!this.valid) return null;
        this.setState({editing:false});
        onClickSave(value);
    };

    onInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        this.validate(value);
        this.setState({ value })
    };

    onEditFieldClick = () => {
        this.setState({editing:true});
    };

    onExitFieldClick = () => {
        this.setState({ editing:false, error:null });
    };

    onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') this.onExitFieldClick();
    };

    validate(value:string){
        const {validation} = this.props;
        if (validation) {
            let result = validation(value);
            const {error, isValid} = result;
            if (isValid) this.setState({error:null});
            else if (error) this.setState({ error });
        }
    }

    get valid() {
        const {error} = this.state;
        return !error;
    }
    get label(){
        const { label } = this.props;
        if (!label) return null;

        const { editing } = this.state;
        let justifyContent = editing ? 'space-between' : 'flex-start';
        return (
            <Flex flexDirection='row' alignItems='center' justifyContent={justifyContent} className='editable-field-header'>
                <div className='editable-field-label'>{label}</div>
                {this.actions}
            </Flex>
        )
    }
    get input(){
        const { editing } = this.state;
        const { defaultValue, type } = this.props;
        if (!editing) return <span className='static-field-value'>{defaultValue}</span>;
        if (type === 'textarea') return null;
        else return (
            <Input onPressEnter={this.onSaveClick}
                   onKeyDown={this.onKeyDown}
                   onChange={this.onInputChange}
                   size='large'
                   defaultValue={defaultValue || ''}/>
        )
    }
    get actions(){
        const { editing } = this.state;
        if (editing) return (
            <Flex>
                {this.valid && <ActionItem icon={<Icon.Save size={14} color='#cccccc' className='editable-field-icon'/>} label='Save (Ent)' onClick={this.onSaveClick}/>}
                <ActionItem icon={<Icon.XSquare size={14} color='#cccccc' className='editable-field-icon'/>} label='Cancel (Esc)' onClick={this.onExitFieldClick}/>
            </Flex>
        );

        else return <Icon.Edit size={14} color='#cccccc' className='editable-field-icon' onClick={this.onEditFieldClick}/>;
    }

    render(){
        const { error, editing } = this.state;
        const { className } = this.props;
        return(
            <div className={`editable-field-container ${className || ''}`}>
                {this.label}
                {this.input}
                <div className='editable-field-error' style={{opacity: editing && error ? 1 : 0, height:12, transform:'translate(0)'}}>{this.state.error || ' '}</div>
            </div>
        )
    }
}

class ActionItem extends Component<{icon:any, label:string, onClick:()=>void}, any> {

    render() {
        const { icon, label, onClick } = this.props;
        return (
            <div onClick={onClick} className='action-item'>
                {icon}
                <div className='action-item-label'>{label}</div>
            </div>
        )
    }
}
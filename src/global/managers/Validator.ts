import {MixedSchema} from "yup";

export interface ValidationObject {
    isValid:boolean,
    error?:string,
}

export default class Validator {

    static yup(schema:MixedSchema, value:any):ValidationObject{
        try {
            schema.validateSync(value);
            return {isValid:true}
        } catch (e) {
            return {isValid:false, error:e.message}
        }
    }
}
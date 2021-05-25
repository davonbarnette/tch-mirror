export default class AppMethods {

    static serialize(model:any, keys:string[]){
        let ret:any = {};

        keys.forEach(key => {
            if (model.hasOwnProperty(key)) ret[key] = model[key];
        });

        return ret;
    }

}
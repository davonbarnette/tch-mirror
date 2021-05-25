
import {decorate, observable} from "mobx";

class AppStoreClass {

    account:        any;

    /* Data Types */
    // realtime:       WSClientManager;

    socket:         any = {};
    initialized:    boolean = false;
    drawer?:        string;
    modal?:         string;
    debug:          any = [];


    constructor(){

    }

    initialize(){

    }

    get necessaryDataIsLoaded(){
        return true
    }


}

decorate(AppStoreClass,{

    account:        observable,

    /* Data Decorators */


});

const AppStore = new AppStoreClass();
export default AppStore;
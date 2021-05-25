import SocketIO from 'socket.io-client'
import Logs from "./Logs";

export default class SocketIOManager {

    io:SocketIOClient.Socket;

    constructor(path:string, callbacks:any, onConnectCallback?:()=>void){
        this.io = SocketIO(path);
        this.registerEventCallbacks(callbacks);
        this.io.on('connect', ()=>this.onConnect(callbacks, onConnectCallback));
    }

    onDisconnect(){
        console.log('disconnected');
    }

    onConnect(callbacks:any, constructorCallback?:()=>void){
        if (constructorCallback) constructorCallback();
    }

    registerEventCallbacks(callbacks:any){
        Object.keys(callbacks).forEach(event =>
            this.io.on(event, (data:any) =>
                this._route(event, data, callbacks[event])))
    }

    _route(event: string, data: any, cb:(...args:any)=>void) {
        Logs.reaction('Routing event: ',event, data);
        cb(data);
    }

    send(event:string, payload:any = null){
        Logs.action('SoIO Send Event: ', event, payload);
        this.io.emit(event, payload);
    }

}
import moment from 'moment';

class LogManager {

    showLogs:string|null = localStorage.getItem('logs');
    logs:any[];

    constructor(){
        this.logs = [];
    }

    on(){
        localStorage.setItem('logs', 'true');
    }
    off(){
        localStorage.setItem('logs', 'false');
    }

    multipleConsoleArgs(message:string, style:any, ...args:[any?, ...any[]]){
        this.logs.push({message, ...args});
        if (this.showLogs != "true") return;

        message = "%c" + message.toUpperCase();

        args.unshift(style);
        args.unshift(message);
        console.log.apply(this, args);
    }

    get Moment(){
        return `[${moment().format('YYYY-MM-DD HH:mm:ssZZ')}]`
    }

    action(message:string, ...args:[any?, ...any[]]){
        let style = "color:red";
        message = this.Moment + "[       ACTION]  " + message;
        this.multipleConsoleArgs(message, style, ...args);
    }

    request(message:string, ...args:[any?, ...any[]]){
        let style = "color:blue";
        message = this.Moment + "[        REQUEST]  " + message;
        this.multipleConsoleArgs(message, style, ...args);
    }

    reaction(message:string, ...args:[any?, ...any[]]){
        let style = "color:green";
        message = this.Moment + "[       REACTION]  " + message;
        this.multipleConsoleArgs(message, style, ...args);
    }

    component(message:string, ...args:[any?, ...any[]]){
        let style = "color:orange";
        message = this.Moment + "[      COMPONENT]  " + message;
        this.multipleConsoleArgs(message, style, ...args);
    }

    misc(message:string, ...args:[any?, ...any[]]){
        this.multipleConsoleArgs(message, null, ...args);
    }
}

const Logs = new LogManager();
export default Logs;

(window as any)['LogsManager'] = Logs;
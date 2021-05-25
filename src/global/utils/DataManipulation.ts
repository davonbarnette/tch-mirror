export default class DataManipulation {

    static compare(a:any, b:any){
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
    }

    static snakeCaseToSentence(text:string){
        let result = text.replace(/_/g, " ");
        return result.charAt(0).toUpperCase() + result.slice(1); // capitalize the first letter - as an example.
    }
}
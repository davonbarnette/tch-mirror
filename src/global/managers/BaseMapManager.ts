import { decorate, observable } from "mobx";

export class BaseMapManager<Tid, T> {

    itemsById: Map<Tid, T> | undefined;
    initialized?:boolean;

    // This is the accessor to get the id field from the item (uid, id, etc.)
    itemIdKey: string;

    constructor(itemIdKey:string, items?: T[]) {
        this.itemIdKey = itemIdKey;
        if (!!items) this.setMultiple(items);
    }

    setMultiple(items: T[]) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            this.setOne(item, false);
        }
        this.setInitialized(true);
    }

    setOne(item: T, initialize = true) {
        if (initialize) this.setInitialized(true);
        if (!this.isInitialized) this.itemsById = new Map();
        let id:Tid = (item as any)[this.itemIdKey];
        this.itemsById!.set(id, item);
    }

    getById(itemId: Tid):T|undefined|null {
        if (!this.isInitialized) return null;
        return this.itemsById!.get(itemId);
    }

    deleteById(itemId: Tid){
        if (!this.isInitialized) return null;
        this.itemsById!.delete(itemId)
    }

    setInitialized(bool:boolean){
        this.initialized = bool;
    }

    setState(itemId: Tid, state:string, to:any){
        let item:any = {...this.getById(itemId)};
        if (item) item[state] = to;
        this.itemsById!.set(itemId, item);
    }

    get isInitialized(){
        // This getter tells whether or not you've gotten a response from the API yet
        return this.itemsById !== undefined;
    }

    get isEmpty(){
        // This getter tells you that we've gotten a response from the API, it just returned empty
        return !this.isInitialized && this.all!.length === 0;
    }

    get all() {
        if (!this.isInitialized) return null;
        return [...this.itemsById!.values() as any];
    }
}

decorate(BaseMapManager, {
    itemsById:observable,
    itemIdKey:observable,
    initialized:observable,
});
import { TriggerListener, TriggerListeners } from "./Trigger";

export class State<T> {
    value: T

    listeners: TriggerListeners<T> = {};
    
    constructor(initialState: T) {
        this.value = initialState;
    }

    set(newState: T) {
        this.value = newState;
        this.notify(newState);
    }

    //
    notify(args: T) {
        for (const listener of Object.values(this.listeners)) {
            listener(args);
        }
    }
    listen(listener: TriggerListener<T>, key?: string): ()=> void {
        const k = key || Date.now().toString();
        if (this.listeners[k]) {
            console.error(`Listener with key ${ k } already exists! In state machine`);
            return ()=> {};
        }
        
        this.listeners[k] = listener;

        return ()=> this.unlisten(k);
    }
    unlisten(key: string) {
        delete this.listeners[key];
    }
}
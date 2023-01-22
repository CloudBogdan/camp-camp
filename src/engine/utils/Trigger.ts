export type TriggerListener<T> = (args: T)=> void;
export type TriggerListeners<T> = {
    [key: string]: TriggerListener<T>
}

export class Trigger<T> {
    name: string
    listeners: TriggerListeners<T> = {};

    constructor(name: string) {
        this.name = name;
    }
    
    notify(args: T) {
        for (const listener of Object.values(this.listeners)) {
            listener(args);
        }
    }

    listen(listener: TriggerListener<T>, key?: string): ()=> void {
        const k = key || Date.now().toString();
        if (this.listeners[k]) {
            console.error(`Listener with key ${ k } already exists! In trigger ${ this.name }`);
            return ()=> {};
        }
        
        this.listeners[k] = listener;

        return ()=> this.unlisten(k);
    }
    unlisten(key: string) {
        delete this.listeners[key];
    }
}
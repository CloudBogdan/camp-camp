import Utils from "../../utils/Utils";
import { Basic } from "./Basic";
import { Object } from "./Object";

export class Group<T extends Object=Object> extends Basic {
    children: T[] = [];
    
    constructor(children: Group<T>["children"]=[]) {
        super();

        this.children = children;
    }

    add(object: T): T {
        this.children.push(object);
        return object;
    }
    destroy(object: T): boolean {
        const removedObj = Utils.removeItem(this.children, object);
        if (!removedObj) return false;
        
        removedObj.destroy();
        return true;
    }

    //
    sortNearestTo(x: number, y: number): T[] {
        return Utils.sortNearestObjectTo(this.children, x, y);
    }
    
    //
    update() {
        super.update();
        
        for (const child of this.children) {
            child.update();
            child.updateJust();
        }
    }
    draw() {
        super.draw();
        
        for (const child of this.children) {
            child.draw();
        }
    }
}
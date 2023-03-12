import { Random } from "../../../../engine";
import Generator from "../../../../managers/Generator";
import { ICost } from "../../../../managers/Inventory";
import { OrderType } from "../../../../managers/orders/Order";
import TreePlantCell from "./TreePlantCell";

export default class TreeCell extends TreePlantCell {
    constructor() {
        super("tree");

        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.PLANT]: 20
        }
        
        this.animation.paused = true;
    }

    create(): void {
        super.create();

        this.frame.y = Random.int(0, 3) * this.frame.height;
    }
    
    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 5,
                remove: true
            }
        }
    }
    getBreakCost(): ICost {
        return {
            "wood": {
                count: 10
            }
        }
    }
    getDisplayName(): string {
        return "дерево";
    }
    getGenerationRule(noiseX: number, noiseY: number, mapSize: number): boolean {
        const value = Generator.simplex(noiseX/7, noiseY/7);
        const randomize = Generator.simplex(noiseX*4, noiseY*4);
        
        return value < .3 || randomize > .9;
    }
}
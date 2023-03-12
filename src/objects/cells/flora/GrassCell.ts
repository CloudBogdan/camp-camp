import { Random } from "../../../engine";
import Generator from "../../../managers/Generator";
import PlantCell from "./PlantCell";
import Cells from "../../../managers/Cells";
import TreeCell from "./trees/TreeCell";
import { OrderType } from "../../../managers/orders/Order";
import { ICost } from "../../../managers/Inventory";

export default class GrassCell extends PlantCell {
    constructor() {
        super("grass");
        
        this.canBePlanted = true;
        this.allowClearOrder = true;
        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.PLANT]: 4,
            [OrderType.CLEAR]: 4
        }
        
        this.animation.paused = true;
    }

    create(): void {
        super.create();

        this.frame.y = Random.int(0, 3) * this.frame.height;
    }

    turnToTree() {
        Cells.destroyCell(this);
        Cells.placeCell(new TreeCell(), this.x, this.y);
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 1,
                remove: true
            }
        }
    }
    getDisplayName(): string {
        return "трава";
    }
    getIsSolid(): boolean {
        return false;
    }
    getGenerationRule(noiseX: number, noiseY: number): boolean {
        const value = Generator.simplex(noiseX/4, noiseY/4);
        const randomize = Generator.simplex(noiseX, noiseY);
        
        return value < .4 || randomize < .2;
    }
}
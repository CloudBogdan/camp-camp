import { Random } from "../../../../engine";
import Generator from "../../../../managers/Generator";
import Inventory, { ICost } from "../../../../managers/Inventory";
import { OrderType } from "../../../../managers/orders/Order";
import Utils from "../../../../utils/Utils";
import TreePlantCell from "./TreePlantCell";

export default class AppleTreeCell extends TreePlantCell {
    constructor() {
        super("apple-tree");
        
        this.allowHarvestOrder = true;
        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.PLANT]: 30
        }
        
        this.animation.frames = [0, 1];
        this.animation.paused = true;
    }

    create(): void {
        super.create();

        this.grown = Random.bool(.2);
    }
    updateAnimations(): void {
        super.updateAnimations();

        this.animation.frameIndex = 0;
        if (this.grown)
            this.animation.frameIndex = 1;
    }

    harvest(success: boolean): void {
        super.harvest(success);

        this.grown = false;

        this.animateScale(1.3, .8);
        this.spawnLeafs();

        if (success) {
            Inventory.store(this.getHarvestCost());
        }
    }

    //
    onGrown(): void {
        this.animateScale(.8, 1.2);
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 5,
                remove: true
            },
            "food": {
                count: 5,
                remove: true
            }
        }
    }
    getHarvestCost(): ICost {
        return {
            "food": {
                count: 10
            }
        };
    }
    getBreakCost(): ICost {
        return {
            "wood": {
                count: 5
            }
        }
    }
    getGrowDuration(): number {
        return Random.int(1200, 1400);
    }
    getDisplayName(): string {
        return "яблоня";
    }
    getGenerationRule(noiseX: number, noiseY: number, mapSize: number): boolean {
        const radial = Utils.distance(noiseX, noiseY, (mapSize-1)/2, (mapSize-1)/2) / mapSize;
        const value = Generator.simplex(noiseX*2, noiseY*2);
        
        return Utils.inBounds(radial, .4, .6) && value < .3;
    }
}
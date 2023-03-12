import Cells from "../../../../managers/Cells";
import Inventory, { ICost } from "../../../../managers/Inventory";
import Order from "../../../../managers/orders/Order";
import Animations from "../../../../utils/Animations";
import Config from "../../../../utils/Config";
import PlantCell from "../PlantCell";

export default class WheatCell extends PlantCell {
    constructor() {
        super("wheat");

        this.canBePlanted = true;
        this.allowHarvestOrder = true;
        this.allowClearOrder = true;
        this.allowHarvestAnim = false;

        this.animation.frames = [0, 1, 2, 3];
        this.animation.paused = true;
    }

    update(): void {
        super.update();

        this.animation.frameIndex = Math.floor(this.growTimer.progress * (this.animation.frames.length-1));
    }

    harvest(success: boolean): void {
        this.destroyed = true;
        
        Animations.scaleDown(this, ()=> {
            Cells.destroyCell(this);
        }, 200);

        if (success)
            Inventory.store(this.getHarvestCost());
    }

    //
    onOrderAdded(order: Order): void {
        super.onOrderAdded(order);

        this.animateScale(1, .8, true);
    }
    
    //
    getHarvestCost(): ICost {
        return {
            "food": {
                count: 20
            }
        }
    }
    getBuildCost(): ICost {
        return {
            "food": {
                count: 5,
                remove: true
            }
        }
    }
    getGrowDuration(): number {
        if (Config.IS_DEV)
            return 120;
            
        return 7200; // 2 minutes
    }
    getDisplayName(): string {
        return "пшеница"
    }
}
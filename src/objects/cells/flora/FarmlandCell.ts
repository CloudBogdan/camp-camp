import Cells from "../../../managers/Cells";
import Inventory, { ICost } from "../../../managers/Inventory";
import Order, { OrderType } from "../../../managers/orders/Order";
import BuildingCell from "../buildings/BuildingCell";

export default class FarmlandCell extends BuildingCell {
    plantCell: Cell;
    
    constructor(plantCell: Cell) {
        super("farmland");

        this.plantCell = plantCell;
        this.allowBreakOrder = true;
        this.allowImproveOrder = false;
        this.allowDrawScaffold = false;

        this.animation.frames = [0, 1, 2, 3];
        this.animation.paused = true;

        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.BREAK]: 5
        }
    }

    create(): void {
        super.create();

        this.stopTween();
        this.animateScale(1.2, .8);

        Inventory.remove(this.plantCell.getBuildCost());
    }
    update(): void {
        super.update();

        if (this.order && this.order.equals([OrderType.PLANT])) {
            this.animation.frameIndex = Math.floor(this.order.progress * this.animation.frames.length);
        } else {
            this.animation.frameIndex = 0;
        }
    }
    
    plant(success: boolean) {
        Cells.destroyCell(this);

        if (success) {
            this.plantCell.allowCreatingAnim = false;
            Cells.placeCell(this.plantCell, this.x, this.y);

            this.plantCell.animateScale(1.4, .6, true);
        }
    }

    //
    onOrderDone(order: Order, success: boolean): void {
        super.onOrderDone(order, success);

        if (order.equals([OrderType.PLANT]))
            this.plant(success);
    }

    //
    getDisplayName(): string {
        return this.plantCell.getDisplayName();
    }
    getBreakCost(): ICost {
        return this.plantCell.getBreakCost();
    }
    getOrderSpeed(order: Order): number {
        if (order.equals([OrderType.PLANT]))
            return this.plantCell.ordersSpeed[OrderType.PLANT];

        return super.getOrderSpeed(order);
    }
}
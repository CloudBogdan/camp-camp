import Cell from "../Cell";
import { ICost } from "../../../managers/Inventory";
import Animations from "../../../utils/Animations";
import { Engine } from "../../../engine";
import Order, { OrderType } from "../../../managers/orders/Order";

export default class PlantCell extends Cell {
    grown: boolean = false;
    
    growTimer = Engine.createTimer();
    allowHarvestOrder: boolean = false;
    allowClearOrder: boolean = false;
    allowHarvestAnim: boolean = true;
    
    constructor(name: string) {
        super(name);
    }

    create(): void {
        super.create();

        this.growTimer.start(this.getGrowDuration()*2);

        if (this.allowCreatingAnim)
            this.animateScale(0, 0, true);
    }
    update(): void {
        super.update();

        if (!this.destroyed && this.growTimer.finished && !this.grown) {
            this.grown = true;
            this.onGrown();
        }
    }
    destroy(): void {
        super.destroy();

        Engine.destroyTimer(this.growTimer);
    }

    harvest(success: boolean) {
        this.growTimer.start(this.getGrowDuration());
    }
    harvestOrder() {
        if (!this.getCanBeHarvested()) return;
        
        this.addOrder(OrderType.HARVEST);
    }

    //
    onGrown() {

    }
    onOrderDone(order: Order, success: boolean): void {
        super.onOrderDone(order, success);
        
        this.growTimer.resume();
        if (order.type == OrderType.HARVEST)
            this.harvest(success);
    }
    onOrderAdded(order: Order): void {
        super.onOrderAdded(order);

        this.growTimer.pause();
        if (this.allowHarvestAnim)
            Animations.shaking(this);
    }
    onOrderCancel(order: Order): void {
        super.onOrderCancel(order);

        this.growTimer.resume();
    }
    
    //
    getHarvestCost(): ICost {
        return {};
    }
    getCanBeHarvested(): boolean {
        return this.grown;
    }
    getGrowDuration(): number {
        return 0;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "собрать",
                onClick: ()=> this.harvestOrder(),
                visible: ()=> this.getOrderType() == null && this.allowHarvestOrder,
                disabled: ()=> !this.getCanBeHarvested(),
                cost: this.getHarvestCost(),
                blur: true
            },
            {
                text: "убрать",
                onClick: ()=> this.addOrder(OrderType.CLEAR),
                visible: ()=> this.getOrderType() == null && this.allowClearOrder,
                cost: this.getBreakCost(),
                blur: true
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
}
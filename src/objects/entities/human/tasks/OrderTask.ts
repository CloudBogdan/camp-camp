import Orders from "../../../../managers/orders/Orders";
import Config from "../../../../utils/Config";
import Utils from "../../../../utils/Utils";
import Human from "../Human";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class OrderTask extends SampleHumanTask {
    targetOrder: Order | null = null;
    
    constructor(order: Order) {
        super(HumanTaskType.ORDER, 2, true);

        this.canTakeOrders = false;
        this.targetOrder = order;
        order.task = this;
    }

    onTake(human: Human): void {
        this.targetCell = this.targetOrder?.targetCell || null;
        
        super.onTake(human);
    }
    onDone(human: Human, success: boolean) {
        Orders.doneOrder(this.targetOrder, success);

        super.onDone(human, success);
    }
    onCancel(human: Human): void {
        Orders.cancelOrder(this.targetOrder);
        
        super.onCancel(human);
    }
    
    executing(human: Human): void {
        super.executing(human);
        
        if (!this.targetOrder) return;
        
        const speed = Utils.clamp(Math.round(30 / Config.TIME_SPEED), 1);
        
        this.targetOrder.targetCell.doOrder(human);
        if (human.time % speed == 0) {
            human.onOrderProcess(this.targetOrder);
        }
    }
}
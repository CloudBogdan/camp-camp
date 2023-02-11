import Config from "../../../../utils/Config";
import Utils from "../../../../utils/Utils";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class OrderTask extends SampleHumanTask {
    constructor(order: Order) {
        super(HumanTaskType.ORDER, 2, true);

        this.canTakeOrders = false;
        this.targetOrder = order;
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
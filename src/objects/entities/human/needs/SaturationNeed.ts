import Inventory from "../../../../managers/Inventory";
import { Order } from "../../../../managers/Orders";
import EatTask from "../tasks/EatTask";
import { HumanTaskType } from "../tasks/SampleHumanTask";
import SampleHumanNeed from "./SampleHumanNeed";

export default class SaturationNeed extends SampleHumanNeed {
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);

        this.value -= 1 / 180;

        if (human.getTaskType() != HumanTaskType.EAT) {
            if (this.value <= this.maxValue/2) {
                if (Inventory.food > 0) {
                    const task = new EatTask(human);
                    human.tasks.addTask(task);
                } else {
                    human.emotion.set("food");
                }
            }
        }
    }

    orderDone(human: Human, order: Order) {
        const difficulty = human.professions.difficulties[order.type] || 0;
        
        this.value -= 5 * difficulty * order.progress;
    }

    onHumanOrderDone(human: Human, order: Order, success: boolean): void {
        this.orderDone(human, order);
    }
    onHumanOrderCancel(human: Human, order: Order): void {
        this.orderDone(human, order);
    }
}
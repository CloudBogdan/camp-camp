import { Engine } from "../../../../engine";
import Inventory from "../../../../managers/Inventory";
import { Order } from "../../../../managers/Orders";
import Human from "../Human";
import EatTask from "../tasks/EatTask";
import { HumanTaskType } from "../tasks/SampleHumanTask";
import SampleHumanNeed from "./SampleHumanNeed";

export default class SaturationNeed extends SampleHumanNeed {
    eatTaskCooldownTimer = Engine.createTimer(1200) // ~20 secs
    
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);

        this.value -= 1 / 180;

        if (!human.hasTasks([HumanTaskType.EAT]) && this.eatTaskCooldownTimer.finished) {
            if (this.value <= this.maxValue/2) {
                if (Inventory.food > 0) {
                    const task = new EatTask(human);
                    human.tasks.addTask(task);
                    console.log("ADDED EAT TASK from saturation need");
                } else {
                    human.emotion.set("food");
                }

                this.eatTaskCooldownTimer.start();
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

    //
    destroy(human: Human): void {
        super.destroy(human);

        Engine.destroyTimer(this.eatTaskCooldownTimer);
    }
}
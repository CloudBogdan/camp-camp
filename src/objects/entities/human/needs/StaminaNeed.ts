import { Order } from "../../../../managers/Orders";
import RestTask from "../tasks/RestTask";
import { HumanTaskType } from "../tasks/SampleHumanTask";
import SampleHumanNeed from "./SampleHumanNeed";

export default class StaminaNeed extends SampleHumanNeed {
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);
        
        this.value += 1 / 120;

        if (!human.getIsBusy()) {
            if (human.dwellingCell)
                this.value += 1 / 30;
            else
                this.value += 1 / 60;
            
            if (this.value <= this.maxValue/2 && !human.tasks.hasTask([HumanTaskType.REST])) {
                const task = new RestTask(human);
                human.tasks.addTask(task);
            }
        }

        if (this.value <= 0)
            human.isTired = true;
        else if (this.value >= this.maxValue/2)
            human.isTired = false;
    }

    orderDone(human: Human, order: Order) {
        const difficulty = human.professions.difficulties[order.type] || 0;
        
        this.value -= 10 * difficulty * order.progress;
    }

    onHumanOrderDone(human: Human, order: Order, success: boolean): void {
        this.orderDone(human, order);
    }
    onHumanOrderCancel(human: Human, order: Order): void {
        this.orderDone(human, order);
    }
}
import { Engine } from "../../../../engine";
import Human from "../Human";
import SampleHumanNeed from "./SampleHumanNeed";

export default class RestNeed extends SampleHumanNeed {
    cooldownTimer = Engine.createTimer(120);
    
    constructor() {
        super(100);
    }

    update(human: Human): void {
        if (!human.getIsBusy()) {
            if (this.cooldownTimer.finished)
                this.value += 1 / 20;
        } else {
            this.cooldownTimer.start();
        }
    }
    
    orderDone(human: Human, order: Order, remove: number=10) {
        const difficulty = human.professions.difficulties[order.type] || 0;
        
        this.value -= remove * difficulty * order.progress;
    }

    onHumanOrderDone(human: Human, order: Order, success: boolean): void {
        this.orderDone(human, order, success ? 10 : 15);
    }
    onHumanOrderCancel(human: Human, order: Order): void {
        this.orderDone(human, order, 10);
    }
}
import { Order } from "../../../../managers/Orders";
import Human from "../Human";
import SampleHumanNeed from "./SampleHumanNeed";

export default class RestNeed extends SampleHumanNeed {
    constructor() {
        super(100);
    }

    update(human: Human): void {
        if (!human.getIsBusy()) {
            this.value += 1 / 30;
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
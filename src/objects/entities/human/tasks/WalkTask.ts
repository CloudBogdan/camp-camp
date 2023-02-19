import { Engine, Random } from "../../../../engine";
import Human from "../Human";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class WalkTask extends SampleHumanTask {
    walkTimer = Engine.createTimer(40);
    
    constructor() {
        super(HumanTaskType.WALK, 0);

        this.allowRepetitions = false;
    }

    onTake(human: Human): void {
        super.onTake(human);

        human.walkAround();
        this.walkTimer.start();
    }
    executing(human: Human): void {
        super.executing(human);
        
        if (human.isStopped && this.walkTimer.finished) {
            this.walkTimer.start();

            if (Random.bool(.5))
                human.walkAround();
            else
                human.tryTakeOrder();
        }
    }

    destroy(human: Human): void {
        super.destroy(human);
        
        Engine.destroyTimer(this.walkTimer);
    }
}
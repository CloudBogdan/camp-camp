import { Engine, Random } from "../../../../engine";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class WalkTask extends SampleHumanTask {
    walkTimer = Engine.createTimer(20);
    
    constructor() {
        super(HumanTaskType.WALK, 0);
    }

    startExecute(human: Human): void {
        super.startExecute(human);

        if (this.walkTimer.finished) {
            human.walkAround();
            this.walkTimer.start();
        }
    }
    executing(human: Human): void {
        super.executing(human);
        
        if (human.isStopped && this.walkTimer.finished) {
            this.walkTimer.start();
            
            if (Random.bool(.4))
                human.walkAround();
        }
    }

    destroy(human: Human): void {
        Engine.destroyTimer(this.walkTimer);
    }
}
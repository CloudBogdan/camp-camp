import { Random } from "../../../../engine";
import Cells from "../../../../managers/Cells";
import { IPoint } from "../../../../utils/types";
import Human from "../Human";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class CommunicateTask extends SampleHumanTask {
    targetHuman!: Human;
    passive: boolean;
    
    constructor(targetHuman?: Human, meetAt?: IPoint, passive: boolean=false) {
        super(HumanTaskType.COMMUNICATE, 1);

        if (targetHuman)
            this.targetHuman = targetHuman;
        if (meetAt)
            this.targetPos = meetAt;
            
        this.passive = passive;
        this.cancelOnDeffer = true;
        this.cancelOnFail = true
    }

    onTake(human: Human): void {
        if (!this.targetHuman || this.targetHuman.getIsBusy(this)) {
            human.tasks.cancelTask(this);
            return;
        }

        const meetAt = Cells.getEmptyPos(
            ()=> this.targetHuman.x + (this.targetHuman.x - human.x)/2 + Random.float(-10, 10),
            ()=> this.targetHuman.y + (this.targetHuman.y - human.y)/2 + Random.float(-10, 10), 
        )

        if (!meetAt) {
            human.tasks.cancelTask(this);
            return;
        }
        
        if (!this.passive) {
            this.targetHuman.tasks.addTask(new CommunicateTask(human, { x: meetAt.x-2, y: meetAt.y }, true));

            this.targetPos = { x: meetAt.x+2, y: meetAt.y }
        }
        
        //
        super.onTake(human);
    }
    executing(human: Human): void {
        super.executing(human);

        if (!this.passive) {
            this.progress += .1 / 60;

            if (this.finished) {
                human.tasks.doneTask(this, true);
                this.targetHuman.tasks.doneTask(this.targetHuman.tasks.getTasksWithType(HumanTaskType.COMMUNICATE)[0], true);
            }
        }
    }

    onDone(human: Human, success: boolean): void {
        super.onDone(human, success);

        human.social.value += 60;
    }
}
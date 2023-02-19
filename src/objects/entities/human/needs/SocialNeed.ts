import { Engine } from "../../../../engine";
import Humans from "../../../../managers/humans/Humans";
import Human from "../Human";
import CommunicateTask from "../tasks/CommunicateTask";
import { HumanTaskType } from "../tasks/SampleHumanTask";
import SampleHumanNeed from "./SampleHumanNeed";

export default class SocialNeed extends SampleHumanNeed {
    communicateTaskCooldown = Engine.createTimer(600) // ~10 secs
    
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);

        if (!human.hasTasks([HumanTaskType.COMMUNICATE])) {
            if (human.getIsBusy())
                this.value -= .5 / 100;
            else
                this.value -= 1 / 100;

            if (human.dwellingCell) {
                this.value -= 1 / 200;
            }
            if (human.professions.isLearning) {
                this.value -= 1 / 200;
            }
        }

        if (this.getIsWantToCommunicate() && this.communicateTaskCooldown.finished && !human.hasTasks([HumanTaskType.COMMUNICATE])) {
            // Eww
            const task = new CommunicateTask();
            // const targetHuman = Humans.humans.filter(h=> h != human && !h.getIsBusy() && h.active && h.social.getIsWantToCommunicate() && !h.hasTasks([HumanTaskType.COMMUNICATE])).sort((a, b)=> a.distance(human.x, human.y) - b.distance(human.x, human.y))[0] || null;

            // if (targetHuman) {
            //     task.targetHuman = targetHuman;
            //     human.tasks.addTask(task);
            // }
            
            this.communicateTaskCooldown.start();
        }
    }
    destroy(human: Human): void {
        super.destroy(human);

        Engine.destroyTimer(this.communicateTaskCooldown);
    }

    //
    getIsWantToCommunicate(): boolean {
        return this.level < .5;
    }
}
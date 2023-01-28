import Humans from "../../../../managers/humans/Humans";
import Inventory from "../../../../managers/Inventory";
import Objects from "../../../../managers/Objects";
import Config from "../../../../utils/Config";
import Human from "../Human";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class EatTask extends SampleHumanTask {
    constructor(human: Human) {
        super(HumanTaskType.EAT, 4);

        this.hasDelay = true;
        this.cancelOnFail = true;
        this.cancelOnDeffer = true;
        this.canTakeOrders = false;
        this.targetCell = human.getHouse();
        this.targetPos = Objects.campfire.getRandomPos(10);
    }

    onTake(human: Human): void {
        super.onTake(human);
    }

        
    // }
    executing(human: Human): void {
        super.executing(human);

        this.progress += 1 / Config.HUMAN_EAT_DURATION;

        if (this.finished) {
            this.eat(human);
        }
    }

    eat(human: Human) {
        const saturation = human.saturation;

        const totalFood = Inventory.items["food"];
        let needToEat = saturation.maxValue - saturation.value;
        
        if (needToEat > totalFood * Config.FOOD_SATURATION) {
            needToEat /= (Humans.count+1);
        }

        saturation.value += needToEat * Config.FOOD_SATURATION;
        const result = Inventory.remove({ "food": needToEat/Config.FOOD_SATURATION });

        human.tasks.doneTask(this, true);
    }
}
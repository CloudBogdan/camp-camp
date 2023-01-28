import { Order } from "../../../../managers/Orders";
import ProfessionCell from "../../../cells/buildings/professions/ProfessionCell";
import SampleHumanNeed from "./SampleHumanNeed";

export default class HappinessNeed extends SampleHumanNeed {
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);

        if (human.rest.level < .5) {
            this.value -= 1 / 240;
        } else if (human.rest.level > .9) {
            this.value += 1 / 300;
        }

        if (human.saturation.level < .3) {
            this.value -= 1 / 180;
        }
    }

    onHumanOrderDone(human: Human, order: Order, success: boolean): void {
        if (!success) {
            human.emotion.set("angry");
            this.value -= 5;
        }
    }
    
    onHumanTakeJob(human: Human, cell: ProfessionCell, profession: HumanProfession): void {
        human.emotion.set("happy");
        this.value += 10;
    }
    onHumanLostJob(human: Human, cell: ProfessionCell, profession: HumanProfession): void {
        human.emotion.set("sad");
        this.value -= 20;
    }
}
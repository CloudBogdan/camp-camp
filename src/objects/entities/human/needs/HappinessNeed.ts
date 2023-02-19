import ProfessionCell from "../../../cells/buildings/professions/ProfessionCell";
import SampleHumanNeed from "./SampleHumanNeed";

export default class HappinessNeed extends SampleHumanNeed {
    constructor() {
        super(100);
    }

    update(human: Human): void {
        super.update(human);
    }

    onHumanOrderDone(human: Human, order: Order, success: boolean): void {
        if (!success) {
            human.emotion.set("angry");
            this.value -= 5;
        }
    }
    
    onHumanTakeJob(human: Human, cell: ProfessionCell, profession: SampleHumanProfession): void {
        human.emotion.set("happy");
        this.value += 10;
    }
    onHumanLostJob(human: Human, cell: ProfessionCell, profession: SampleHumanProfession): void {
        human.emotion.set("sad");
        this.value -= 20;
    }
}
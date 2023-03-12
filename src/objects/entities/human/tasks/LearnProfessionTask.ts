import Config from "../../../../utils/Config";
import ProfessionCell from "../../../cells/buildings/professions/ProfessionCell";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class LearnProfessionTask extends SampleHumanTask {
    professionCell: ProfessionCell;
    
    constructor(human: Human, professionCell: ProfessionCell) {
        super(HumanTaskType.LEARN_PROFESSION, 1);

        this.professionCell = professionCell;
        this.targetCell = professionCell;
        this.cancelOnFail = true;
        this.allowRepetitions = false;
        this.canTakeOrders = false;
    }

    onTake(human: Human): void {
        super.onTake(human);

        this.professionCell.own(human);
    }
    onDone(human: Human, success: boolean): void {
        super.onDone(human, success);

        const professionCell = human.dwellingCell;
        if (success && professionCell && professionCell instanceof ProfessionCell) {
            professionCell.hireWorker(human);
            professionCell.release(human);
        }
    }
    executing(human: Human): void {
        super.executing(human);

        if (human.dwellingCell && human.dwellingCell instanceof ProfessionCell) {
            human.professions.isLearning = true;
            
            this.progress += 1 / Config.HUMAN_STUDY_DURATION
            
            if (this.finished) {
                human.tasks.doneTask(this, true);
            }
        }
    }
}
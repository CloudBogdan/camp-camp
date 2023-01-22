import Objects from "../../../../managers/Objects";
import { HumanState } from "../Human";
import SampleHumanTask, { HumanTaskType } from "./SampleHumanTask";

export default class RestTask extends SampleHumanTask {
    constructor(human: Human) {
        super(HumanTaskType.REST, 1, false);

        this.hasDelay = true;
        this.cancelOnFail = true;
        this.targetCell = human.getHouse();
        this.targetPos = Objects.campfire.getRandomPos(10);
    }

    onTake(human: Human): void {
        super.onTake(human);

        human.emotion.set("tired");
    }
    startExecute(human: Human): void {
        super.startExecute(human);

        human.state.set(HumanState.SLEEP);
    }
    executing(human: Human): void {
        super.executing(human);

        const stamina = human.stamina;
        
        if (stamina && stamina.value >= stamina.maxValue) {
            human.tasks.doneTask(this, true);
        }
    }

    onDone(human: Human): void {
        super.onDone(human);
        human.state.set(HumanState.NORMAL);
    }
    onCancel(human: Human): void {
        super.onCancel(human);
        human.state.set(HumanState.NORMAL);
    }
    onDeferred(human: Human): void {
        super.onDeferred(human);
        human.state.set(HumanState.NORMAL);
    }

    //
    getCanTakeOrders(human: Human): boolean {
        return !human.isTired
    }
}
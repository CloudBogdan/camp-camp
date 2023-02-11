import Utils from "../../../../utils/Utils";
import SampleHumanTask from "../tasks/SampleHumanTask";

export default class SampleHumanNeed {
    maxValue: number;
    private _value: number = 0;
    
    constructor(maxValue: number=100) {
        this.maxValue = maxValue;
        this._value = maxValue;
    }

    update(human: Human) {}
    destroy(human: Human) {}

    onHumanTakeOrder(human: Human, order: Order) {}
    onHumanOrderCancel(human: Human, order: Order) {}
    onHumanOrderDone(human: Human, order: Order, success: boolean) {}
    onHumanOrderProcess(human: Human, order: Order) {}

    onHumanTakeTask(human: Human, task: SampleHumanTask) {}
    onHumanTaskAdded(human: Human, task: SampleHumanTask) {}
    onHumanTaskCancel(human: Human, task: SampleHumanTask) {}
    onHumanTaskDone(human: Human, task: SampleHumanTask, success: boolean) {}

    onHumanEnterDwelling(human: Human, dwellingCell: DwellingCell) {}
    onHumanOutDwelling(human: Human, dwellingCell: DwellingCell) {}

    onHumanTakeJob(human: Human, cell: ProfessionCell, profession: SampleHumanProfession) {}
    onHumanLostJob(human: Human, cell: ProfessionCell, profession: SampleHumanProfession) {}

    // Get / set
    get value(): number {
        return this._value;
    }
    set value(v: number) {
        this._value = Utils.clamp(v, 0, this.maxValue);
    }
    get level(): number {
        return this.value / this.maxValue;
    }
    get isFull(): boolean {
        return this.value >= this.maxValue;
    }
}
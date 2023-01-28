import { Order } from "../../../managers/Orders";
import SampleHumanNeed from "./needs/SampleHumanNeed";
import SampleHumanTask from "./tasks/SampleHumanTask";

export default class HumanNeeds {
    human: Human

    map: { [key: string]: SampleHumanNeed } = {};
    
    constructor(human: Human) {
        this.human = human;
    }

    addNeed(name: string, need: SampleHumanNeed) {
        this.map[name] = need;
    }
    getNeed(name: string): SampleHumanNeed | null {
        return this.map[name] || null;
    }

    //
    updateNeeds() {
        for (const need of Object.values(this.map)) {
            need.update(this.human);
        }
    }
    destroy() {
        for (const need of Object.values(this.map)) {
            need.destroy(this.human);
        }
    }
    
    //
    onTakeOrder(order: Order) {
        for (const need of Object.values(this.map)) {
            need.onHumanTakeOrder(this.human, order);
        }
    }
    onOrderCancel(order: Order) {
        for (const need of Object.values(this.map)) {
            need.onHumanOrderCancel(this.human, order);
        }
    }
    onOrderDone(order: Order, success: boolean) {
        for (const need of Object.values(this.map)) {
            need.onHumanOrderDone(this.human, order, success);
        }
    }
    onOrderProcess(order: Order) {
        for (const need of Object.values(this.map)) {
            need.onHumanOrderProcess(this.human, order);
        }
    }

    onTakeTask(task: SampleHumanTask) {
        for (const need of Object.values(this.map)) {
            need.onHumanTakeTask(this.human, task);
        }
    }
    onTaskAdded(task: SampleHumanTask) {
        for (const need of Object.values(this.map)) {
            need.onHumanTaskAdded(this.human, task);
        }
    }
    onTaskCancel(task: SampleHumanTask) {
        for (const need of Object.values(this.map)) {
            need.onHumanTaskCancel(this.human, task);
        }
    }
    onTaskDone(task: SampleHumanTask, success: boolean) {
        for (const need of Object.values(this.map)) {
            need.onHumanTaskDone(this.human, task, success);
        }
    }

    onEnterDwelling(dwellingCell: DwellingCell) {
        for (const need of Object.values(this.map)) {
            need.onHumanEnterDwelling(this.human, dwellingCell);
        }
    }
    onOutDwelling(dwellingCell: DwellingCell) {
        for (const need of Object.values(this.map)) {
            need.onHumanOutDwelling(this.human, dwellingCell);
        }
    }

    onTakeJob(cell: ProfessionCell, profession: HumanProfession) {
        for (const need of Object.values(this.map)) {
            need.onHumanTakeJob(this.human, cell, profession);
        }
    }
    onLostJob(cell: ProfessionCell, profession: HumanProfession) {
        for (const need of Object.values(this.map)) {
            need.onHumanLostJob(this.human, cell, profession);
        }
    }
}
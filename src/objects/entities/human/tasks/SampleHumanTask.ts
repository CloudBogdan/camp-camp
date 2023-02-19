import Orders from "../../../../managers/orders/Orders";
import Config from "../../../../utils/Config";
import { IPoint } from "../../../../utils/types";
import Utils from "../../../../utils/Utils";

export enum HumanTaskType {
    ORDER = "order",
    MOVE_TO = "move-to",
    USE_CELL = "use-cell",
    REST = "rest",
    EAT = "eat",
    LEARN_PROFESSION = "learn-profession",
    WALK = "walk",
    COMMUNICATE = "communicate"
}

export default class SampleHumanTask {
    type: HumanTaskType;
    active: boolean = false;
    process: boolean = false;
    exists: boolean = true;
    priority: number;
    time: number;
    private _progress: number = 0;

    isWork: boolean = false;
    cancelOnFail: boolean = false;
    cancelOnDeffer: boolean = false;
    canTakeOrders: boolean = true;
    allowRepetitions: boolean = true;

    targetCell: Cell | null = null;
    targetPos: IPoint | null = null;
    
    constructor(type: HumanTaskType, priority: number, isWork: boolean=false) {
        this.type = type;
        this.priority = priority;
        this.time = Date.now();
        this.isWork = isWork;
    }

    onAdded(human: Human) {
        human.onTaskAdded(this);
    }
    onTake(human: Human) {
        this.active = true;
        
        const targetCell = this.targetCell;
        
        if (targetCell)
            human.moveToCell(targetCell);
        else if (this.targetPos)
            human.moveTo(this.targetPos.x, this.targetPos.y);

        if (Config.LOG_TASKS) {
            console.log(`\n== ${ this.type.toUpperCase() } ==`)
            console.log(`⏩ ${ this.type.toUpperCase() } - Task took`);
        }
            
        human.onTakeTask(this);
    }
    onDone(human: Human, success: boolean) {
        if (Config.LOG_TASKS)
            console.log(`✅ ${ this.type.toUpperCase() } - Task done`);

        this.destroy(human);
        
        human.onTaskDone(this, success);
    }
    onCancel(human: Human) {
        if (Config.LOG_TASKS)
            console.log(`⭕ ${ this.type.toUpperCase() } - Task cancel`);
            
        this.destroy(human);
        
        human.onTaskCancel(this);
    }
    onDeferred(human: Human) {
        this.active = false;
        this.process = false;

        if (this.cancelOnDeffer)
            human.tasks.cancelTask(this);
    }
    startExecute(human: Human) {
        this.process = true;
    }
    executing(human: Human) {
        if (!this.process) {
            this.startExecute(human);
        }
        
        if (this.targetCell) {
            const result = this.targetCell.use(human);

            if (!result ? this.cancelOnFail : false)
                human.tasks.cancelTask(this);
        }
    }
    update(human: Human) {
        const targetCell = this.targetCell;
        const targetPos = targetCell ? targetCell.getCenter() : this.targetPos;
        const hasTarget = !!targetCell || !!this.targetPos;

        if (hasTarget && targetPos) {
            if (human.isStopped && human.distance(targetPos.x, targetPos.y) < 8) {
                this.executing(human);
            }
        } else
            this.executing(human);

        if (targetCell ? targetCell.destroyed : false) {
            human.tasks.cancelTask(this);
        }
    }
    destroy(human: Human) {
        this.exists = false;
        this.active = false;
        this.process = false;
    }

    //
    getPriority(): number {
        return this.priority;
    }
    getCanTakeOrders(human: Human): boolean {
        return this.active ? this.canTakeOrders : true;
    }
    
    //
    equals(types: HumanTaskType[]): boolean {
        for (const type of types) {
            if (this.type == type)
                return true;
        }

        return false;
    }

    // Get/set
    get finished(): boolean {
        return this.progress >= 1;
    }
    get progress(): number {
        return this._progress;
    }
    set progress(value: number) {
        this._progress = Utils.clamp(value, 0, 1);
    }
}
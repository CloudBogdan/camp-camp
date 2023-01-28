import { Order } from "../../../../managers/Orders";
import { IPoint } from "../../../../utils/types";
import Utils from "../../../../utils/Utils";

export enum HumanTaskType {
    ORDER,
    MOVE_TO,
    USE_CELL,
    REST,
    EAT,
    LEARN_PROFESSION,
    WALK
}

export default class SampleHumanTask {
    type: HumanTaskType;
    active: boolean = false;
    priority: number;
    time: number;
    private _progress: number = 0;

    isWork: boolean = false;
    cancelOnFail: boolean = false;
    cancelOnDeffer: boolean = false;
    hasDelay: boolean = false;
    canTakeOrders: boolean = true;

    targetOrder: Order | null = null;
    targetCell: Cell | null = null;
    targetPos: IPoint | null = null;
    
    constructor(type: HumanTaskType, priority: number, isWork: boolean=false) {
        this.type = type;
        this.priority = priority;
        this.time = Date.now();
        this.isWork = isWork;
    }

    onAdded(human: Human) {

    }
    onTake(human: Human) {
        const targetCell = this.targetCell || this.targetOrder?.targetCell;
        
        if (targetCell)
            human.moveToCell(targetCell);
        else if (this.targetPos)
            human.moveTo(this.targetPos.x, this.targetPos.y);
    }
    startExecute(human: Human) {
        this.active = true;
    }
    executing(human: Human) {
        if (!this.active) {
            this.startExecute(human);
        }
        
        if (this.targetCell) {
            const result = this.targetCell.use(human);

            if (!result ? this.cancelOnFail : false)
                human.tasks.cancelTask(this);
        }
    }
    onDone(human: Human) {
        this.destroy(human);
    }
    onCancel(human: Human) {
        this.destroy(human);
    }
    onDeferred(human: Human) {
        this.active = false;

        if (this.cancelOnDeffer)
            human.tasks.cancelTask(this);
    }
    update(human: Human) {
        const targetCell = this.targetCell || this.targetOrder?.targetCell;
        const targetPos = targetCell ? targetCell.getCenter() : this.targetPos;
        const hasTarget = !!targetCell || !!this.targetPos;

        if (hasTarget && targetPos) {
            const isTargetNear = human.isStopped && human.distance(targetPos.x, targetPos.y) < 8;
            
            if (isTargetNear) {
                this.executing(human);
            }
        } else
            this.executing(human);

        if (targetCell && targetCell.destroyed) {
            human.tasks.cancelTask(this);
        }
    }
    destroy(human: Human) {
        this.active = false;
    }

    //
    getPriority(): number {
        return this.priority;
    }
    getCanTakeOrders(human: Human): boolean {
        return this.canTakeOrders;
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
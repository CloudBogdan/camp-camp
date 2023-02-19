import OrderTask from "../../objects/entities/human/tasks/OrderTask";
import OrderParticle from "../../objects/particles/OrderParticle";
import Particles from "../Particles";

export enum OrderType {
    BUILD,
    UPGRADE,

    MINE,
    CHOP,
    BREAK,
    CLEAR,
    HARVEST,
}
export enum OrderCategory {
    SIMPLE,
    ART,
    ORE
}
export default class Order {
    exists: boolean = true;
    type: OrderType;
    targetCell: Cell;
    executor: Human | null = null;
    task: SampleHumanTask | null = null;
    progress: number = 0;
    category: OrderCategory;

    constructor(type: OrderType, targetCell: Cell, category: OrderCategory=OrderCategory.SIMPLE) {
        this.type = type;
        this.targetCell = targetCell;
        this.category = category;
    }

    onAdd() {
        this.targetCell.onOrderAdded(this);

        // Particle
        Particles.addParticles(()=> new OrderParticle(), ()=> this.targetCell.x, ()=> this.targetCell.y);
    }
    onTake(executor: Human) {
        this.executor = executor;

        const task = new OrderTask(this);
        this.executor.tasks.addTask(task);
        
        this.executor.onTakeOrder(this);
        this.targetCell.onTakeOrder(this);
    }
    onDone(success: boolean) {
        this.destroy()

        this.targetCell.onOrderDone(this, success);
        if (this.executor) {
            this.executor.onOrderDone(this, success);
            this.executor.tasks.doneTask(this.task, success);
        }
    }
    onCancel() {
        this.destroy()

        this.targetCell.onOrderCancel(this);
        if (this.executor) {
            this.executor.onOrderCancel(this);
            this.executor.tasks.cancelTask(this.task);
        }
        
        // Particle
        const orderParticle = new OrderParticle();
        orderParticle.animation.reversed = true;
        orderParticle.animation.frameIndex = orderParticle.animation.frames.length-1;
        Particles.addParticles(()=> orderParticle, ()=> this.targetCell.x, ()=> this.targetCell.y);
    }

    //
    destroy() {
        this.exists = false;
    }
    
    //
    equals(types: OrderType[]): boolean {
        for (const type of types) {
            if (this.type == type)
                return true;
        }

        return false;
    }
    
    get finished(): boolean {
        return this.progress >= 1;
    }
    get active(): boolean {
        return !!this.executor && !!this.targetCell;
    }
}
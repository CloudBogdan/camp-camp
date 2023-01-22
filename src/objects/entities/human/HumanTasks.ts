import Orders, { Order } from "../../../managers/Orders";
import Utils from "../../../utils/Utils";
import SampleHumanTask, { HumanTaskType } from "./tasks/SampleHumanTask";

export default class HumanTasks {
    human: Human;

    current: SampleHumanTask | null = null;
    queue: SampleHumanTask[] = [];
    
    constructor(human: Human) {
        this.human = human;
    }

    hasTask(types: HumanTaskType[]): boolean {
        for (const task of this.queue) {
            if (types.indexOf(task.type) >= 0)
                return true;
        }

        return false;
    }
    getTasksWithType(type: HumanTaskType): SampleHumanTask[] {
        return this.queue.filter(task=> task.type == type);
    }
    getTasksWithOrder(order: Order): SampleHumanTask[] {
        return [...this.queue.filter(t=> t.targetOrder == order)];
    }
    getSortedTasks(): SampleHumanTask[] {
        return this.queue.sort((a, b)=> {
            const aPriority = a.getPriority();
            const bPriority = b.getPriority();
            
            if (aPriority > bPriority)
                return 1;
            else if (aPriority < bPriority)
                return -1;
                
            if (a.time > b.time)
                return 1;
                
            return 0;
        }).reverse();
    }

    changeCurrentTask(): SampleHumanTask | null {
        const lastTask = this.current;
        const newTask = this.getSortedTasks()[0] || null;

        this.current = newTask;

        if (lastTask != newTask) {
            if (lastTask) {
                lastTask.onDeferred(this.human);
            }
        }
        
        if (newTask) {
            if (newTask) {
                this.human.onTakeTask(newTask);
                newTask.onTake(this.human);
            }

        }
        
        return newTask;
    }
    
    //
    addTask(task: SampleHumanTask): SampleHumanTask {
        this.queue.push(task);

        task.onAdded(this.human);
        this.changeCurrentTask();

        this.human.onTaskAdded(task);

        return task;
    }
    cancelTask(task: SampleHumanTask): SampleHumanTask | null {
        const removedTask = Utils.removeItem(this.queue, task);
        if (!removedTask) return null;

        removedTask.onCancel(this.human);
        Orders.cancelOrder(removedTask.targetOrder);
        this.changeCurrentTask();

        this.human.onTaskCancel(removedTask);

        return removedTask
    }
    doneTask(task: SampleHumanTask, success: boolean): SampleHumanTask | null {
        const removedTask = Utils.removeItem(this.queue, task);
        if (!removedTask) return null;

        removedTask.onDone(this.human);
        Orders.doneOrder(removedTask.targetOrder, success);
        this.changeCurrentTask();

        this.human.onTaskDone(removedTask, success);

        return removedTask
    }

    updateCurrentTask() {
        const task = this.current;
        if (!task) return;

        task.update(this.human);
    }

    // Get
    get count(): number {
        return this.queue.length;
    }
}
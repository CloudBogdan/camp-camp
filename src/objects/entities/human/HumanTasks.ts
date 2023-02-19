import Orders from "../../../managers/orders/Orders";
import Utils from "../../../utils/Utils";

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
    getSortedTasks(): SampleHumanTask[] {
        return this.queue.sort((a, b)=> {
            const aPriority = a.getPriority();
            const bPriority = b.getPriority();
            
            if (aPriority > bPriority)
                return 1;
            else if (aPriority < bPriority)
                return -1;
                
            return a.time - b.time;
        }).reverse();
    }

    changeCurrentTask(): { newTask: SampleHumanTask | null, lastTask: SampleHumanTask | null } {
        const lastTask = this.current;
        const newTask = this.getSortedTasks()[0] || null;

        if (lastTask != newTask) {
            if (lastTask)
                lastTask.onDeferred(this.human);
                
            this.takeTask(newTask)
        }
        
        return { newTask, lastTask };
    }
    
    //
    addTask(task: SampleHumanTask): SampleHumanTask | null {
        if (!(task.allowRepetitions ? true : !this.hasTask([task.type])))
            return null;
        
        this.queue.push(task);
        task.onAdded(this.human);
        this.changeCurrentTask()

        return task;
    }
    takeTask(task: SampleHumanTask | null) {
        if (this.current == task) return;
        
        this.current = task;
        if (task)
            task.onTake(this.human);
    }
    cancelTask(task: SampleHumanTask | null): SampleHumanTask | null {
        const removedTask = Utils.removeItem(this.queue, task);
        if (!removedTask || !removedTask.exists) return null;

        removedTask.onCancel(this.human);
        this.changeCurrentTask()

        return removedTask
    }
    doneTask(task: SampleHumanTask | null, success: boolean): SampleHumanTask | null {
        const removedTask = Utils.removeItem(this.queue, task);
        if (!removedTask || !removedTask.exists) return null;

        removedTask.onDone(this.human, success);
        this.changeCurrentTask()

        return removedTask
    }

    cancelTasksByType(type: HumanTaskType) {
        for (const task of this.queue) {
            if (task.type == type)
                this.cancelTask(task);
        }
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
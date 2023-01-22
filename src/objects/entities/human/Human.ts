import { Keyboard, Random, Renderer, State } from "../../../engine";
import Palette from "../../../utils/Palette";
import Orders, { Order } from "../../../managers/Orders";
import Entity from "../Entity";
import DwellingCell from "../../cells/buildings/DwellingCell";
import HumanTasks from "./HumanTasks";
import Utils from "../../../utils/Utils";
import { IArrayPoint, IPoint } from "../../../utils/types";
import Pathfinding from "../../../utils/Pathfinding";
import Cells from "../../../managers/Cells";
import ProfessionCell from "../../cells/buildings/professions/ProfessionCell";;
import EmotionCloud, { Emotion } from "./EmotionCloud";
import OrderTask from "./tasks/OrderTask";
import HumanProfessions from "./HumanProfessions";
import NoneProfession from "./professions/NoneProfession";
import HumanNeeds from "./HumanNeeds";
import HappinessNeed from "./needs/HappinessNeed";
import SaturationNeed from "./needs/SaturationNeed";
import StaminaNeed from "./needs/StaminaNeed";
import LearnProfessionTask from "./tasks/LearnProfessionTask";
import WalkTask from "./tasks/WalkTask";
import RestNeed from "./needs/RestNeed";
import Objects from "../../../managers/Objects";
import SampleHumanTask, { HumanTaskType } from "./tasks/SampleHumanTask";

export enum HumanState {
    NORMAL,
    SLEEP
}

export default class Human extends Entity {
    tasks = new HumanTasks(this);
    professions = new HumanProfessions(this);
    needs = new HumanNeeds(this);

    happiness = new HappinessNeed();
    saturation = new SaturationNeed();
    stamina = new StaminaNeed();
    rest = new RestNeed();
    isTired: boolean = false;

    dwellingCell: DwellingCell | null = null;

    state = new State<HumanState>(HumanState.NORMAL);
    emotion = new EmotionCloud(this);
    
    constructor() {
        super("human");

        this.width = 1;
        this.height = 2;

        this.needs.addNeed("happiness", this.happiness);
        this.needs.addNeed("saturation", this.saturation);
        this.needs.addNeed("stamina", this.stamina);
        this.needs.addNeed("rest", this.rest);
    }

    create() {
        const walkTask = new WalkTask();
        this.tasks.addTask(walkTask);
                
        this.findOrder();
        this.findProfession();
    }
    update(): void {
        super.update();

        if (Keyboard.justKey("K"))
            this.findProfession();
        if (Keyboard.justKey("e"))
            this.emotion.set(Random.item<Emotion>(["happy", "angry", "sad", "tired"]));
        
        this.emotion.update();

        this.needs.updateNeeds();
            
        this.updateTask();
        this.updateState();
    }
    updateTask() {
        this.tasks.updateCurrentTask();

        if (this.dwellingCell && !(this.tasks.current?.targetCell instanceof DwellingCell)) {
            this.releaseFromDwelling();
        }
    }
    updateState() {
        if (this.state.value == HumanState.NORMAL) {
            this.width = 1;
            this.height = 2;
        } else if (this.state.value == HumanState.SLEEP) {
            this.width = 2;
            this.height = 1;
        }
    }
    
    draw(): void {
        if (!this.visible || !this.active) return;
        
        let color = this.professions.current.color || Palette.WHITE;
        
        Renderer.rect(
            Math.floor(this.x),
            Math.floor(this.y - this.height),
            this.width, this.height,
            color
        );

        this.emotion.draw();
    }

    getHouse(): HouseCell | null {
        if (this.dwellingCell)
            return this.dwellingCell;
        
        const houses = Cells.getNearestHousesTo(this.x, this.y, this);

        return houses[0] || null;
    }
    findOrder() {
        const newOrder = Orders.takeSuitableOrder(this);
        if (!newOrder) {
            this.walkAround();
        }
    }
    
    //
    onTakeOrder(order: Order) {
        const task = new OrderTask(order);
        this.tasks.addTask(task);

        this.releaseFromDwelling();

        this.needs.onTakeOrder(order);
    }
    onOrderCancel(order: Order) {
        this.tasks.getTasksWithOrder(order).map(task=>
            this.tasks.cancelTask(task)
        );

        this.needs.onOrderCancel(order);
    }
    onOrderDone(order: Order, success: boolean) {
        this.tasks.getTasksWithOrder(order).map(task=>
            this.tasks.doneTask(task, success)
        );

        this.needs.onOrderDone(order, success);
    }
    onOrderProcess(order: Order) {
        this.needs.onOrderProcess(order);
    }

    onTakeTask(task: SampleHumanTask) {
        this.needs.onTakeTask(task);
    }
    onTaskAdded(task: SampleHumanTask) {
        this.needs.onTaskAdded(task);
    }
    onTaskCancel(task: SampleHumanTask) {
        this.findOrder();
        this.findProfession();
        
        this.needs.onTaskCancel(task);
    }
    onTaskDone(task: SampleHumanTask, success: boolean) {
        this.findOrder();
        this.findProfession();

        this.needs.onTaskDone(task, success);
    }
    
    onEnterDwelling(dwellingCell: DwellingCell) {
        this.active = false;
        this.dwellingCell = dwellingCell;

        this.needs.onEnterDwelling(dwellingCell);
    }
    onOutDwelling(dwellingCell: DwellingCell) {
        this.active = true;
        this.dwellingCell = null;

        this.needs.onOutDwelling(dwellingCell);
    }

    onTakeJob(cell: ProfessionCell, profession: HumanProfession) {
        this.needs.onTakeJob(cell, profession);
    }
    onLostJob(cell: ProfessionCell, profession: HumanProfession) {
        this.needs.onLostJob(cell, profession);
    }

    onCellsChanged() {
        this.updatePath();
    }
    
    //
    pathToOrder(order: Order | null): IArrayPoint[] {
        if (!order) return [];
        
        const targetPos = order.targetCell.getNearestPosTo(this.x, this.y);
        const path = [...Pathfinding.findPath(this.x, this.y, targetPos.x, targetPos.y)];

        return path;
    }
    walkAround(): void {
        const tryGetPos: (i: number)=> IPoint | null = (iterations: number)=> {
            const pos = Cells.getEmptyPos(
                ()=> this.x + Random.int(-10, 10),
                ()=> this.y + Random.int(-10, 10)
            );

            if (iterations > 10)
                return null;
            if ((!pos || Objects.campfire.distance(pos.x, pos.y) > 30))
                return tryGetPos(iterations + 1);

            return pos;
        }

        const pos = tryGetPos(0);
        
        if (pos)
            this.moveTo(pos.x, pos.y);
    }
    updatePath(): boolean {
        const curOrder = this.getCurOrder();
        if (curOrder) {
            const path = this.pathToOrder(curOrder);
            if (path.length == 0)
                Orders.doneOrder(curOrder, false);
        }

        return super.updatePath();
    }
    findProfession() {
        if (!this.professions.is(NoneProfession) || this.getIsBusy()) return;

        const cell = Utils.sortNearestObjectTo(Cells.getCells<ProfessionCell>(ProfessionCell), this.x, this.y).filter(c=> c.getLetIn())[0];
        if (cell) {
            const task = new LearnProfessionTask(cell);
            this.tasks.addTask(task);
        }
    }
    releaseFromDwelling() {
        if (this.dwellingCell)
            this.dwellingCell.release(this);
    }

    // Get
    getTaskType(): HumanTaskType | null {
        return this.tasks.current ? this.tasks.current.type : null;
    }
    getTaskPriority(): number {
        return this.tasks.current ? this.tasks.current.priority : -1;
    }
    getCanTakeOrders(): boolean {
        return !this.professions.learning && !this.isTired && (this.tasks.current ? this.tasks.current.getCanTakeOrders(this) : true);
    }
    getCurOrder(): Order | null {
        const curTask = this.tasks.current;
        if (!curTask) return null;

        return curTask.targetOrder;
    }
    getIsBusy(comparableTask?: SampleHumanTask | null): boolean {
        if (comparableTask !== undefined) {
            const curPriority = Utils.safeValue(this.tasks.current?.priority, -1);
            const priority = Utils.safeValue(comparableTask?.priority, -1);

            return curPriority > priority;
        }
        
        return this.tasks.current ? this.tasks.current.isWork : false;
    }
    getCurrentOrder(): Order | null {
        return this.tasks.current ? this.tasks.current.targetOrder : null;
    }
}
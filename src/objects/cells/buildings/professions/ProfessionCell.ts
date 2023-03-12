import DwellingCell from "../DwellingCell";
import NoneProfession from "../../../entities/human/professions/NoneProfession";
import { OrderType } from "../../../../managers/orders/Order";
import { HumanTaskType } from "../../../entities/human/tasks/SampleHumanTask";

export default class ProfessionCell extends DwellingCell {
    owner: Human | null = null;
    worker: Human | null = null;
    
    constructor(name: string) {
        super(name);
    }
    
    destroy(): void {
        super.destroy();
        this.dismissWorker();
    }
    
    own(human: Human): boolean {
        if (this.owner) return false;
        
        this.owner = human;
        human.professionCell = this;
        return true;
    }
    hireWorker(human: Human) {
        const profession = new (this.getProfessionClass());
        
        this.worker = human;
        this.worker.professions.isLearning = false;
        this.worker.professions.set(profession);
        this.worker.onTakeJob(this, profession);
    }
    dismissWorker() {
        if (this.worker) {
            this.worker.onLostJob(this, this.worker.professions.current);
            this.worker.professions.set(new NoneProfession());

            this.owner = null;
            this.worker = null
        }
    }

    onTakeOrder(order: Order): void {
        if (order.equals([OrderType.BREAK, OrderType.UPGRADE])) {
            for (const human of this.humans) {
                human.tasks.cancelTasksByType(HumanTaskType.LEARN_PROFESSION);
            }
        }
        
        super.onTakeOrder(order);
    }
    
    //
    getIsLearning(): boolean {
        return this.humans[0] ? this.humans[0].professions.isLearning : false;
    }
    getOrdersMenuTab(menu: OrdersMenu) {
        return [
            {
                text: "уволить",
                onClick: ()=> this.dismissWorker(),
                visible: ()=> !!this.worker && !this.getIsLearning(),
                blur: true,
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
    getProfessionClass(): TypeofSampleHumanProfession {
        return NoneProfession;
    }
    getNamePrefix(): string {
        if (this.getIsLearning()) {
            return "(учится)"
        }
        
        return super.getNamePrefix();
    }
    getLetIn(human: Human): boolean {
        return !this.worker && (!!this.owner ? this.owner == human : true) && super.getLetIn(human);
    }
}
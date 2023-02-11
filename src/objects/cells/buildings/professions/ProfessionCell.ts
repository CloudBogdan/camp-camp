import DwellingCell from "../DwellingCell";
import NoneProfession from "../../../entities/human/professions/NoneProfession";
import { OrderType } from "../../../../managers/orders/Order";

export default class ProfessionCell extends DwellingCell {
    owner: Human | null = null;
    
    constructor(name: string) {
        super(name);
    }
    
    destroy(): void {
        super.destroy();
        this.dismiss();
    }
    
    stopLearning(human: Human): void {
        human.professions.stopLearning();
    }
    enter(human: Human): boolean {
        const result = super.enter(human)
        
        return result && this.learnProfession(human);
    }
    own(human: Human): boolean {
        if (this.owner) return false;
        
        this.owner = human;
        return true;
    }
    learnProfession(human: Human): boolean {
        const ProfessionClass = this.getProfessionClass();
        if (human.professions.is(ProfessionClass)) return false;

        human.professions.learn(new ProfessionClass()).then(profession=> {
            this.release(human);
            human.onTakeJob(this, profession);
        });
        
        return true;
    }
    dismiss() {
        if (this.owner) {
            this.owner.onLostJob(this, this.owner.professions.current);
            this.owner.professions.set(new NoneProfession());
            this.owner = null;
        }
    }

    onTakeOrder(order: Order): void {
        if (order.equals([OrderType.BREAK, OrderType.UPGRADE])) {
            for (const human of this.humans) {
                this.stopLearning(human);
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
                onClick: ()=> this.dismiss(),
                visible: ()=> (this.owner ? this.owner.professions.is(this.getProfessionClass()) : false) && !this.getIsLearning(),
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
    getLetIn(): boolean {
        return !this.owner && super.getLetIn();
    }
}
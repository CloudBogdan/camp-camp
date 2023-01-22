import { IMenuButton } from "../../../../menus/Menu";
import OrdersMenu from "../../../../gui/game/OrdersMenu";
import DwellingCell from "../DwellingCell";
import NoneProfession from "../../../entities/human/professions/NoneProfession";

export default class ProfessionCell extends DwellingCell {
    owner: Human | null = null;
    
    constructor(name: string) {
        super(name);
    }
    
    destroy(): void {
        super.destroy();
        this.dismiss();
    }
    
    release(human: Human): void {
        human.professions.stopLearning();
        
        super.release(human);
    }
    enter(human: Human): boolean {
        const result = super.enter(human)
        
        return result && this.own(human);
    }
    own(human: Human): boolean {
        if (this.owner || this.owner == human) return false;

        const profession = this.getProfession();

        this.owner = human;
        human.professions.learn(profession).then(()=> {
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

    //
    getIsLearning(): boolean {
        return this.humans[0] ? this.humans[0].professions.learning : false;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "уволить",
                onClick: ()=> this.dismiss(),
                visible: ()=> !!this.owner && !this.getIsLearning(),
                blur: true,
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
    getProfession(): HumanProfession {
        return new NoneProfession();
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
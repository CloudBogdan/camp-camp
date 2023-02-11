import { OrderType } from "../../../managers/orders/Order";
import Utils from "../../../utils/Utils";
import BuildingCell from "./BuildingCell";

export default class DwellingCell extends BuildingCell {
    humans: Human[] = [];
    
    constructor(name: string) {
        super(name);

        this.animation.paused = true;
    }

    onTakeOrder(order: Order): void {
        super.onTakeOrder(order);

        if (order.equals([OrderType.BREAK, OrderType.UPGRADE])) {
            this.releaseAll();
        }
    }

    //
    use(human: Human): boolean {
        super.use(human);
        
        if (this.humans.indexOf(human) < 0)
            return this.enter(human);

        return true;
    }
    enter(human: Human): boolean {
        if (!this.getLetIn()) return false;
        
        this.humans.push(human);
        human.onEnterDwelling(this);

        return true;
    }
    release(human: Human) {
        human.onOutDwelling(this);
        Utils.removeItem(this.humans, human);
    }
    releaseAll() {
        for (const human of [...this.humans]) {
            this.release(human);
        }
    }
    hasHuman(human: Human): boolean {
        return this.humans.indexOf(human) >= 0;
    }

    //
    update(): void {
        super.update();

        this.animation.frameIndex = 0;
        if (this.humans.length > 0)
            this.animation.frameIndex = 1

        this.updateHumans();
    }
    updateHumans() {
        for (const human of this.humans) {
            human.update();
        }
    }
    
    // Get
    getLetIn(): boolean {
        return (
            this.humans.length < this.getMaxHumans() &&
            (this.order ? !this.order.equals([OrderType.BREAK, OrderType.UPGRADE]) : true)
        ); 
    }
    getMaxHumans(): number {
        return 1;
    }
}
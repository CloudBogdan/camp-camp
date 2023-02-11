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
    type: OrderType;
    targetCell: Cell;
    executor: Human | null = null;
    progress: number = 0;
    category: OrderCategory;

    constructor(type: OrderType, targetCell: Cell, category: OrderCategory=OrderCategory.SIMPLE) {
        this.type = type;
        this.targetCell = targetCell;
        this.category = category;
    }

    onAdd() {
        this.targetCell.onOrderAdded(this);
    }
    onTake(executor: Human) {
        
    }
    onDone() {

    }
    onCancel() {

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
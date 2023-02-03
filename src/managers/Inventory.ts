import Config from "../utils/Config"

export interface IItemsStack {
    [key: string]: number
}
export interface ICost {
    [key: string]: {
        count: number
        remove?: boolean
    }
}

export default class Inventory {
    static items: IItemsStack = Config.IS_DEV ? {
        "food": 20,
        "wood": 200,
        "stone": 200,
    } : {
        "food": 50,
        "wood": 0,
        "stone": 0,
    }

    //
    static toStack(cost: ICost): IItemsStack {
        const stack: IItemsStack = {};
        
        Object.keys(cost).map(itemType=> {
            stack[itemType] = cost[itemType].count;
        });

        return stack;
    }
    
    static canRemove(stack: IItemsStack | ICost): boolean {
        for (const itemType of Object.keys(stack)) {
            const itemsCountOrParams = stack[itemType];
            
            if (typeof itemsCountOrParams == "number") {
                if (this.items[itemType] - itemsCountOrParams < 0)
                    return false;
            } else {
                if (itemsCountOrParams.remove && this.items[itemType] - itemsCountOrParams.count < 0)
                    return false;
            }
        }
        
        return true;
    }
    
    //
    static store(stack: IItemsStack | ICost) {
        for (const itemType of Object.keys(stack)) {
            const itemsCountOrParams = stack[itemType];

            if (typeof itemsCountOrParams == "number")
                this.items[itemType] += Math.round(itemsCountOrParams);
            else {
                if (!itemsCountOrParams.remove)
                    this.items[itemType] += Math.round(itemsCountOrParams.count);
            }
        }
    }
    static remove(stack: IItemsStack | ICost): boolean {
        if (!this.canRemove(stack)) return false;

        for (const itemType of Object.keys(stack)) {
            const itemsCountOrParams = stack[itemType];
            if (typeof itemsCountOrParams == "number")
                this.items[itemType] -= Math.round(itemsCountOrParams);
            else {
                if (itemsCountOrParams.remove)
                    this.items[itemType] -= Math.round(itemsCountOrParams.count);
            }
        }

        return true;
    }

    static getIsCriticalFoodCount(): boolean {
        return this.food <= 5;
    }
    static getIsCriticalWoodCount(): boolean {
        return this.wood == 0;
    }
    static getIsCriticalStoneCount(): boolean {
        return this.stone == 0;
    }

    // Get
    static get food(): number {
        return this.items["food"];
    }
    static get wood(): number {
        return this.items["wood"];
    }
    static get stone(): number {
        return this.items["stone"];
    }
}
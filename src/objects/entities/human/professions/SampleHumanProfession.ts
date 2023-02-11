import { OrderCategory, OrderType } from "../../../../managers/orders/Order";

export interface IProfessionValues {
    [key: number]: number
}

export default class SampleHumanProfession {
    onlyCategories: OrderCategory[] = [OrderCategory.SIMPLE];
    priorityOrders: OrderType[] = [];
    color: string | null = null;
    speedMultipliers: IProfessionValues = {
        [OrderType.BUILD]: 1,
        [OrderType.CHOP]: 1,
        [OrderType.BREAK]: 1,
        [OrderType.UPGRADE]: 1,
        [OrderType.CLEAR]: 1,
        [OrderType.MINE]: 1,
        [OrderType.HARVEST]: 1,
    }
    successChances: IProfessionValues = {
        [OrderType.BUILD]: .7,
        [OrderType.CHOP]: .9,
        
        [OrderType.BREAK]: .9,
        [OrderType.UPGRADE]: .8,
        [OrderType.CLEAR]: .7,
        [OrderType.MINE]: .8,
        [OrderType.HARVEST]: .7
    }
    difficulties: IProfessionValues = {
        [OrderType.BUILD]: 1.2,
        [OrderType.CHOP]: 1,
        [OrderType.BREAK]: .8,
        [OrderType.UPGRADE]: .9,
        [OrderType.CLEAR]: .3,
        [OrderType.MINE]: 1.6,
        [OrderType.HARVEST]: .8
    }

    setMultiplier(value: IProfessionValues) {
        this.speedMultipliers = {
            ...this.speedMultipliers,
            ...value
        }
    }
    setSuccessChance(value: IProfessionValues) {
        this.successChances = {
            ...this.successChances,
            ...value
        }
    }
}
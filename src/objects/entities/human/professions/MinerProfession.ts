import { OrderCategory, OrderType } from "../../../../managers/Orders";
import Palette from "../../../../utils/Palette";
import SampleHumanProfession from "./SampleHumanProfession";

export default class MinerProfession extends SampleHumanProfession {
    constructor() {
        super();
        
        this.onlyCategories.push(OrderCategory.ORE);
        this.priorityOrders = [OrderType.MINE];
        this.color = Palette.STONE;
        this.setMultiplier({
            [OrderType.BREAK]: .8,
            [OrderType.MINE]: .5
        })
        this.setSuccessChance({
            [OrderType.BREAK]: 1,
            [OrderType.MINE]: 1
        })
    }
}
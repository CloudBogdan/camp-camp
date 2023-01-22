import { OrderCategory, OrderType } from "../../../../managers/Orders";
import Palette from "../../../../utils/Palette";
import SampleHumanProfession from "./SampleHumanProfession";

export default class ArchitectProfession extends SampleHumanProfession {
    constructor() {
        super();
        
        this.onlyCategories.push(OrderCategory.ART);
        this.priorityOrders = [OrderType.UPGRADE];
        this.color = Palette.LIGHT_BLUE;
        this.setMultiplier({
            [OrderType.BUILD]: .9,
            [OrderType.UPGRADE]: .6
        })
        this.setSuccessChance({
            [OrderType.BUILD]: .8,
            [OrderType.UPGRADE]: .95,
            [OrderType.MINE]: .9
        })
    }
}
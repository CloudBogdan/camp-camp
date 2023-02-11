import { OrderType } from "../../../../managers/orders/Order";
import Palette from "../../../../utils/Palette";
import SampleHumanProfession from "./SampleHumanProfession";

export default class GardenerProfession extends SampleHumanProfession {
    constructor() {
        super();
        
        this.priorityOrders = [OrderType.CHOP];
        this.color = Palette.RED;
        this.setMultiplier({
            [OrderType.CHOP]: .6,
            [OrderType.CLEAR]: .6,
            [OrderType.HARVEST]: .8
        })
        this.setSuccessChance({
            [OrderType.CHOP]: 1,
            [OrderType.CLEAR]: 1,
            [OrderType.HARVEST]: .9,
        })
    }
}
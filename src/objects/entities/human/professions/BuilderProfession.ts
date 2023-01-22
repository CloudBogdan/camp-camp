import { OrderType } from "../../../../managers/Orders";
import Palette from "../../../../utils/Palette";
import SampleHumanProfession from "./SampleHumanProfession";

export default class BuilderProfession extends SampleHumanProfession {
    constructor() {
        super();
        
        this.priorityOrders = [OrderType.BREAK, OrderType.BUILD];
        this.color = Palette.ORANGE;
        this.setMultiplier({
            [OrderType.BUILD]: .7,
            [OrderType.BREAK]: .5
        })
        this.setSuccessChance({
            [OrderType.BUILD]: 1,
            [OrderType.BREAK]: 1
        })
    }
}
import { Random } from "../../../engine";
import { OrderCategory, OrderType } from "../../../managers/orders/Order";
import BuildingCell from "./BuildingCell";

export default class StatueCell extends BuildingCell {
    constructor() {
        super("statue");

        this.orderCategory = OrderCategory.ART;
        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.BUILD]: 2
        }
    }

    create(): void {
        super.create();

        this.frame.y = Random.int(0, 4) * this.frame.height;
    }

    //
    getDisplayName(): string {
        return "статуя";
    }
}
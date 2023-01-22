import { Random } from "../../../engine";
import Generator from "../../../managers/Generator";
import { OrderType } from "../../../managers/Orders";
import { IMenuButton } from "../../../menus/Menu";
import OrdersMenu from "../../../gui/game/OrdersMenu";
import PlantCell from "./PlantCell";
import Cells from "../../../managers/Cells";
import TreeCell from "./trees/TreeCell";

export default class GrassCell extends PlantCell {
    constructor() {
        super("grass");
        
        this.animation.paused = true;

        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.CLEAR]: 4
        }
    }

    create(): void {
        super.create();

        this.frame.y = Random.int(0, 3) * this.frame.height;
    }

    turnToTree() {
        Cells.destroyCell(this);
        Cells.placeCell(new TreeCell(), this.x, this.y);
    }

    //
    getDisplayName(): string {
        return "трава";
    }
    getIsSolid(): boolean {
        return false;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "убрать",
                onClick: ()=> this.addOrder(OrderType.CLEAR),
                visible: ()=> this.getOrderType() == null,
                blur: true
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
    getGenerationRule(noiseX: number, noiseY: number): boolean {
        const value = Generator.simplex(noiseX/2, noiseY/2);
        const randomize = Generator.simplex(noiseX*4, noiseY*4);
        
        return value < .2;
    }
}
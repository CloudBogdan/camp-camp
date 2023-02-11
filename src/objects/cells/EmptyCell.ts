import Cell from "./Cell";
import Config from "../../utils/Config";

export default class EmptyCell extends Cell {
    constructor() {
        super("empty");

        this.visible = false;
    }

    //
    getIsSolid(): boolean {
        return false;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            { text: "строить", tab: "build" },
            { text: "<place>", tab: "place", visible: ()=> Config.IS_DEV },
        ]
    }
    getDisplayName(): string {
        return "";
    }
}
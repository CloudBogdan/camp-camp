import { Assets } from "../../../engine/core/Assets";
import Cells from "../../../managers/Cells";
import { Order, OrderType } from "../../../managers/Orders";
import { IMenuButton } from "../../../menus/Menu";
import OrdersMenu from "../../../gui/game/OrdersMenu";
import Utils from "../../../utils/Utils";
import Cell from "../Cell";
import BuildingCell from "./BuildingCell";
import Inventory, { ICost } from "../../../managers/Inventory";

export default class LayoutCell extends BuildingCell {
    buildingCell: Cell;
    
    constructor(buildingCell: Cell) {
        super("layout");

        this.buildingCell = buildingCell;
        this.cellsWidth = buildingCell.cellsWidth;
        this.cellsHeight = buildingCell.cellsHeight;

        this.allowImproveOrder = false;
        this.allowDrawScaffold = false;

        this.image = Assets.getImage(`layout-${ this.cellsWidth }x${ this.cellsHeight }`);
        this.animation.paused = true;
        this.animation.frames = [0, 1, 2, 3];
        this.animation.onFrameChanged.listen(()=> {
            this.animateScale(1.2, .8);
        })

        this.ordersSpeed = {
            ...this.ordersSpeed,
            [OrderType.BREAK]: 10
        }

        this.load();
    }

    create(): void {
        super.create();

        this.stopTween();
        this.animateScale(.6, 1.4);

        Inventory.remove(this.buildingCell.getBuildCost());
    }
    
    update(): void {
        super.update();

        if (this.order && this.order.equals([OrderType.BUILD])) {
            this.animation.frameIndex = Math.floor(this.order.progress * this.animation.frames.length);
        } else {
            this.animation.frameIndex = 0;
        }
    }
    build(success: boolean) {
        Cells.destroyCell(this);

        if (success)
            Cells.placeCell(this.buildingCell, this.x, this.y);
    }

    //
    onOrderDone(order: Order, success: boolean): void {
        super.onOrderDone(order, success);

        if (order.equals([OrderType.BUILD]))
            this.build(success);
    }

    //
    getBreakCost(): ICost {
        return this.buildingCell.getBreakCost();
    }
    getOrderSpeed(order: Order): number {
        if (order.equals([OrderType.BUILD]))
            return this.buildingCell.ordersSpeed[OrderType.BUILD];

        return super.getOrderSpeed(order);
    }
    getNamePrefix(): string {
        if (this.getOrderType() == null)
            return "(пауза)"
        else if (this.order && this.order.equals([OrderType.BUILD]))
            return `(${ Utils.percent(this.order.progress) })`
            
        return super.getNamePrefix();
    }
    getDisplayName(): string {
        return this.buildingCell.getDisplayName();
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "строить",
                onClick: ()=> this.addOrder(OrderType.BUILD),
                visible: ()=> this.getOrderType() == null,
                blur: true 
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
}
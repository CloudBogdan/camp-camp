import { Renderer } from "../../../engine";
import { Assets } from "../../../engine/core/Assets";
import { OrderType } from "../../../managers/Orders";
import { IMenuButton } from "../../../menus/Menu";
import ImprovableCell from "../ImprovableCell";

export default class BuildingCell extends ImprovableCell {
    scaffoldingImage: HTMLImageElement | null = null;
    
    allowBreakOrder: boolean = true;
    allowDrawScaffold: boolean = true;
    
    constructor(name: string) {
        super(name);
        
        this.canBeBuilt = true;

        this.load();
    }

    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "разобрать",
                onClick: ()=> this.breakOrder(),
                visible: ()=> this.getOrderType() == null && this.allowBreakOrder,
                cost: this.getBreakCost(),
                blur: true 
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
    
    //
    create(): void {
        super.create();

        this.animateScale(1.3, .7);
    }
    load(): void {
        super.load();

        this.scaffoldingImage = Assets.getImage(`scaffolding-${ this.cellsWidth }x${ this.cellsHeight }`);
    }

    draw(): void {
        super.draw();

        if (this.allowDrawScaffold)
            this.drawScaffold();
    }
    drawScaffold() {
        if (this.order?.equals([OrderType.BREAK, OrderType.UPGRADE]))
            Renderer.sprite(this.scaffoldingImage, this.x, this.y, 0, 0, this.width, this.height);
    }
}
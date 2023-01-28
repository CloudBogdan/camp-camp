import { Engine, FontColor, Renderer } from "../engine";
import { Assets } from "../engine/core/Assets";
import Config from "../utils/Config";
import Orders, { OrderType } from "./Orders";

export default class PlayerHelpers {
    static highlightHumans: boolean = false;
    static highlightOrders: boolean = false;
    static highlightStatName: string | null = null;
    static showAdvancedStats: boolean = Config.IS_DEV ? true : false;
    
    static tooltipText: string = "";
    static tooltipColor: FontColor = "gray";
    
    static orderImage: HTMLImageElement;
    
    static start() {
        this.orderImage = Assets.getImage("order")!;
    }
    static draw() {
        if (this.highlightOrders) {
            for (const order of Orders.orders) {
                const targetCell = order.targetCell;
                
                let sx = 0;

                if (order.type == OrderType.CHOP)
                    sx = 0;
                else if (order.type == OrderType.MINE)
                    sx = 8;
                else if (order.type == OrderType.HARVEST)
                    sx = 16;
                else if (order.type == OrderType.BUILD)
                    sx = 24;
                else if (order.type == OrderType.CLEAR || order.type == OrderType.BREAK)
                    sx = 32;
                else if (order.type == OrderType.UPGRADE)
                    sx = 40;
                
                Renderer.context.globalAlpha = order.active ? (Engine.time % 60 < 40 ? 1 : 0) : 1;
                    
                for (let j = 0; j < targetCell.cellsWidth; j ++) {
                    for (let k = 0; k < targetCell.cellsHeight; k ++) {
                        Renderer.sprite(
                            this.orderImage,
                            targetCell.x + j*8, targetCell.y + k*8,
                            sx, 0, 8, 8
                        );
                    }
                }

                Renderer.context.globalAlpha = 1;
            }
        }
    }

    //
    static setTooltip(text: string, color: FontColor="gray") {
        this.tooltipText = text;
        this.tooltipColor = color;
    }
}
import { Engine, FontColor, Renderer } from "../../engine";
import PlayerHelpers from "../../managers/PlayerHelpers";
import Config from "../../utils/Config";

import OrdersMenu from "./OrdersMenu";
import StatisticsGui from "./StatisticsGui";

export default class GameGui {
    static fps = 0;
    
    static ordersMenu: OrdersMenu;
    static statistics: StatisticsGui;
    
    static start() {
        this.ordersMenu = new OrdersMenu();
        this.statistics = new StatisticsGui(this);
    }
    static update() {
        this.ordersMenu.update();
        this.statistics.update();
    }
    static draw() {
        if (Config.IS_DEV) {
            if (Engine.clock.time % 20 == 0)
                this.fps = Engine.clock.fps;
            Renderer.text(Math.floor(this.fps).toString(), 0, 0);
        }
        
        this.drawTooltip();
        
        this.ordersMenu.draw();
        this.statistics.draw();
    }

    private static drawTooltip() {
        Renderer.text(
            PlayerHelpers.tooltipText,
            Engine.width/2 - Config.WORLD_OFFSET_X,
            8 - Config.WORLD_OFFSET_Y,
            PlayerHelpers.tooltipColor, "center"
        );
    }
}
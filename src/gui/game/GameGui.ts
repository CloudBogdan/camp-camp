import { Engine, Renderer } from "../../engine";
import Config from "../../utils/Config";

import PlayerHelpers from "../../managers/PlayerHelpers";
import GameGuiObjects from "./GameGuiObjects";

export default class GameGui {
    static fps = 0;
    
    static start() {
        GameGuiObjects.start()
    }
    static update() {
        GameGuiObjects.ordersMenu.update();
        GameGuiObjects.statistics.update();
    }
    static draw() {
        if (Config.IS_DEV) {
            if (Engine.clock.time % 20 == 0)
                this.fps = Engine.clock.fps;
            Renderer.text(Math.floor(this.fps).toString(), 0, 0);
        }
        
        this.drawTooltip();
        
        GameGuiObjects.ordersMenu.draw();
        GameGuiObjects.statistics.draw();
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
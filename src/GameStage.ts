import { Engine, Keyboard, Stage } from "./engine";
import Config from "./utils/Config";

import GameGui from "./gui/game/GameGui";
import NavGrid from "./managers/NavGrid";
import Screen from "./managers/Screen";
import World from "./managers/World";
import CellsRegistry from "./registries/CellsRegistry";

export default class GameStage extends Stage {
    start() {
        CellsRegistry.init()
        
        super.start();
        
        GameGui.start();
        World.start();
        NavGrid.start();
    }
    update() {
        super.update();
        
        if (Keyboard.justKey("I") && Config.IS_DEV)
            Engine.isDebug = !Engine.isDebug;
        
        Screen.update();
        World.update();
        GameGui.update();
    }
    draw() {
        super.draw();
        
        World.draw();
        NavGrid.draw()
        
        GameGui.draw();
    }
    destroy(): void {
        super.destroy();

        World.destroy();
    }
}
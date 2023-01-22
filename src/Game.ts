import { Engine, Keyboard, Renderer } from "./engine";
import Config from "./utils/Config";
import Palette from "./utils/Palette";

import GameGui from "./gui/game/GameGui";
import NavGrid from "./managers/Nav";
import Screen from "./managers/Screen";
import World from "./managers/World";

export default class Game {
    static focusedMenu: Menu | null = null;
    
    static start() {
        World.start();
        GameGui.start();
    }
    static update() {
        if (Keyboard.justKey("H") && Config.IS_DEV)
            Engine.isDebug = !Engine.isDebug;
        
        Screen.update();
        World.update();
        GameGui.update();
    }
    static draw() {
        Renderer.background(Palette.BLACK);
        
        World.draw();

        if (Engine.isDebug)
            for (let y = 0; y < Config.WORLD_NAV_SIZE; y ++) {
                for (let x = 0; x < Config.WORLD_NAV_SIZE; x ++) {
                    if (!NavGrid.navGrid.isWalkableAt(x, y))
                        Renderer.rect(x * Config.NAV_GRID_SIZE, y * Config.NAV_GRID_SIZE, Config.NAV_GRID_SIZE, Config.NAV_GRID_SIZE, "#f00")
                }
            }
        
        GameGui.draw();
    }
}
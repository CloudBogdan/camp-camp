import { Engine, Keyboard, Renderer } from "./engine";
import Config from "./utils/Config";
import Palette from "./utils/Palette";

import GameGui from "./gui/game/GameGui";
import NavGrid from "./managers/NavGrid";
import Screen from "./managers/Screen";
import World from "./managers/World";

export default class Game {
    static focusedMenu: Menu | null = null;
    
    static start() {
        World.start();
        GameGui.start();
        NavGrid.start();
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
        NavGrid.draw()
        
        GameGui.draw();
    }
}
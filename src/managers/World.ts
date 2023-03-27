import { Engine, Random, Renderer } from "../engine";
import Config from "../utils/Config";
import Palette from "../utils/Palette";

import NavGrid from "./NavGrid";
import Cells from "./Cells";
import Humans from "./humans/Humans";
import CampfireCell from "../objects/cells/buildings/CampfireCell";
import Orders from "./orders/Orders";
import Generator from "./Generator";
import Particles from "./particles/Particles";
import Flora from "./Flora";
import PlayerHelpers from "./PlayerHelpers";
import Objects from "./Objects";
import Screen from "./Screen";
import WorldEvents from "./world-events/WorldEvents";

export default class World {
    // 
    static start() {        
        Objects.start();
        
        const campfireX = Screen.width/2 + Random.float(-2, 2) * Config.GRID_SIZE;
        const campfireY = Screen.height/2 + Random.float(-2, 2) * Config.GRID_SIZE;
        
        Cells.start();
        
        Generator.start();
        Generator.generate();
        
        Humans.start();
        Flora.start();

        PlayerHelpers.start();
        WorldEvents.start();

        for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j ++) {
                const cell = Cells.getCellAt(campfireX + i*Config.GRID_SIZE - Config.GRID_SIZE, campfireY + j*Config.GRID_SIZE - Config.GRID_SIZE);
                if (cell && !(cell instanceof CampfireCell))
                    Cells.destroyCell(cell);
            }
        }
        
        Cells.placeCell(Objects.campfire, campfireX, campfireY);

        //
        Cells.onChanged.listen(()=> {
            NavGrid.updateNavGrid();

            Humans.onCellsChanged();
            Orders.onCellsChanged();
        });
    }
    static update() {
        //
        Cells.update();
        Humans.update();
        Particles.update();
        Flora.update();
        WorldEvents.update();

        Objects.cursor.update();

        if (Engine.time % Config.DAY_DURATION == 0)
            this.day();
    }
    static day() {
        WorldEvents.day();
    }
    
    static draw() {
        Renderer.save();
        Renderer.translate(Screen.x, Screen.y);
        
        Renderer.context.globalAlpha = (PlayerHelpers.highlightOrders || PlayerHelpers.highlightHumans) ? .5 : 1;
        
        Renderer.rect(0, 0, Screen.width, Screen.height, Palette.GROUND);

        Cells.draw();
            
        Renderer.context.globalAlpha = 1;
        
        PlayerHelpers.draw();
            
        Humans.draw();
        Particles.draw();

        Objects.cursor.draw();

        Renderer.restore();
    }
    static destroy() {
        Humans.destroy();
        Cells.destroy();
        Generator.destroy();
    }
}
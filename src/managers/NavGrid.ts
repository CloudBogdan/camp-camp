import Config from "../utils/Config";
import Cells from "./Cells";
import * as PF from "pathfinding";
import { Engine, Renderer } from "../engine";
import Screen from "./Screen";

export default class NavGrid {
    static navGrid: PF.Grid = new PF.Grid(Config.WORLD_NAV_SIZE, Config.WORLD_NAV_SIZE);
    
    static start() {
        this.updateNavGrid();
    }
    static draw() {
        if (Engine.isDebug)
            for (let y = 0; y < Config.WORLD_NAV_SIZE; y ++) {
                for (let x = 0; x < Config.WORLD_NAV_SIZE; x ++) {
                    if (!NavGrid.navGrid.isWalkableAt(x, y))
                        Renderer.rect(
                            Screen.x + x * Config.NAV_GRID_SIZE,
                            Screen.y + y * Config.NAV_GRID_SIZE,
                            Config.NAV_GRID_SIZE, Config.NAV_GRID_SIZE, "#f00"
                        );
                }
            }
    }
    
    //
    static updateNavGrid() {
        for (let y = 0; y < Config.WORLD_NAV_SIZE; y ++) {
            for (let x = 0; x < Config.WORLD_NAV_SIZE; x ++) {
                this.navGrid.setWalkableAt(x, y, true);
            }
        }
        
        for (let y = 0; y < Config.WORLD_NAV_SIZE; y ++) {
            for (let x = 0; x < Config.WORLD_NAV_SIZE; x ++) {
                const cell = Cells.getCellAtGrid(x * Config.NAV_GRID_SIZE, y * Config.NAV_GRID_SIZE, Config.NAV_GRID_SIZE);
                
                if (cell && cell.getIsSolid()) {

                    for (let cx = 0; cx < cell.cellsWidth; cx ++) {

                        if (this.navGrid.isInside(x + cx*2, y + 1))
                            this.navGrid.setWalkableAt(x + cx*2, y + 1, false);
                        if (this.navGrid.isInside(x + cx*2+1, y + 1))
                            this.navGrid.setWalkableAt(x + cx*2+1, y + 1, false);
                            
                    }

                    if (this.navGrid.isInside(x, y + 1))
                        this.navGrid.setWalkableAt(x, y + 1, true);

                }
            }
        }
    }
}
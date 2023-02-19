import { Random } from "../engine";
import * as Noise from "../engine/utils/noise";
import Config from "../utils/Config";

import CellsRegistry from "../registries/CellsRegistry";
import Cells from "./Cells";

export default class Generator {
    static seed: number = 0;
    
    static start() {
        this.seed = Date.now();

        if (Config.IS_DEV) {
            this.seed = 1672760807702;
            console.log(this.seed);
        }
        
        Noise.seed(this.seed);
    }

    static generate() {
        let time = 0;
        
        const cellsCallback = CellsRegistry.getCellsCallbackArray();
        const size = Config.WORLD_SIZE;
        
        for (let y = 0; y < size; y ++) {
            for (let x = 0; x < size; x ++) {

                for (const cellCallback of cellsCallback) {
                    const cell = cellCallback();

                    if (cell.getGenerationRule(x, y, size)) {
                        cell.time = Random.int(0, 100);
                        Cells.placeCell(cell, x*Config.GRID_SIZE, y*Config.GRID_SIZE);
                    }
                }
            }
        }
    }

    //
    static simplex(x: number, y: number): number {
        const value = (Noise.simplex2(x, y) + 1)/2;
        return value;
    }
}
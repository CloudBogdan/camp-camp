import { Engine, Random } from "../engine";
import Utils from "../utils/Utils";
import { IPoint } from "../utils/types";
import Config from "../utils/Config";

import Cell from "../objects/cells/Cell";
import GrassCell from "../objects/cells/flora/GrassCell";
import TreeCell from "../objects/cells/flora/trees/TreeCell";
import Cells from "./Cells";
import Screen from "./Screen";

export default class Flora {
    static growGrassDelayTimer = Engine.createTimer(this.getGrowGrassDelayDuration());
    static growTreeDelayTimer = Engine.createTimer(this.getGrowTreeDelayDuration());
    
    static start() {
        this.growGrassDelayTimer.start();
        this.growTreeDelayTimer.start();
    }
    static update() {
        this.updateGrowGrass();
        this.updateGrowTree();
    }

    static updateGrowGrass() {
        if (!this.growGrassDelayTimer.justFinished) return;
        this.growGrassDelayTimer.start(this.getGrowGrassDelayDuration());

        let pos: IPoint | null = null
        
        if (Random.bool(.7)) {
            const grassCells = Cells.getCells<GrassCell>(GrassCell);
            const grass = Random.item(grassCells);
            pos = this.getRandomPosNearCell(grass);
        } else {
            const treeCells = Cells.getCells<TreeCell>(TreeCell);
            const tree = Random.item(treeCells);
            pos = this.getRandomPosNearCell(tree);
        }

        if (pos)
            Cells.placeCell(new GrassCell(), pos.x, pos.y);
    }
    static updateGrowTree() {
        if (!this.growTreeDelayTimer.justFinished) return;
        this.growTreeDelayTimer.start(this.getGrowTreeDelayDuration());

        const growAtGrass = ()=> {
            const grassCells = Cells.getCells<GrassCell>(GrassCell);
            const grass = Random.item(grassCells);

            if (grass) {
                Cells.destroyCell(grass);
                Cells.placeCell(new TreeCell(), grass.x, grass.y);
            }
        }

        const treeCells = Cells.getCells<TreeCell>(TreeCell);
        
        if (Random.bool(.8)) {
            if (treeCells.length > 0) {
                const tree = Random.item(treeCells);
                const pos = this.getRandomPosNearCell(tree, true);

                if (pos)
                    Cells.placeCell(new TreeCell(), pos.x, pos.y);
            } else
                growAtGrass();
        } else {
            growAtGrass();
        }
    }

    //
    static getGrowGrassDelayDuration(): number {
        return Random.int(600, 900);
    }
    static getGrowTreeDelayDuration(): number {
        return Random.int(1000, 1300);
    }
    static getRandomPosNearCell(cell: Cell | null, onlyNearCell: boolean=false): IPoint | null {
        if (cell) {
            const dir = Utils.randomDirection(Config.SPRITE_SIZE);
            const pos = Cells.getEmptyPos(
                ()=> cell.x + dir.x,
                ()=> cell.y + dir.y
            )

            return pos;
        }
        if (onlyNearCell)
            return null;

        return Cells.getEmptyPos(
            ()=> Random.int(0, Screen.width),
            ()=> Random.int(0, Screen.height)
        );
    }
}
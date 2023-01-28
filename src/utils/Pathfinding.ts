import * as PF from "pathfinding";
import NavGrid from "../managers/NavGrid";
import Config from "./Config";
import { IArrayPoint } from "./types";
import Utils from "./Utils";

export default class Pathfinding {
    static findPath(fromX: number, fromY: number, toX: number, toY: number): IArrayPoint[] {
        const pos = Utils.toChunkPos(fromX, fromY, Config.NAV_GRID_SIZE);
        const targetPos = Utils.toChunkPos(toX, toY, Config.NAV_GRID_SIZE);

        pos.x = Utils.clamp(pos.x, 0, Config.WORLD_NAV_SIZE-1);
        pos.y = Utils.clamp(pos.y, 0, Config.WORLD_NAV_SIZE-1);
        targetPos.x = Utils.clamp(targetPos.x, 0, Config.WORLD_NAV_SIZE-1);
        targetPos.y = Utils.clamp(targetPos.y, 0, Config.WORLD_NAV_SIZE-1);
        
        const finder = new PF.AStarFinder({ diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles });

        return finder.findPath(pos.x, pos.y, targetPos.x, targetPos.y, NavGrid.navGrid.clone()) as IArrayPoint[];
    }
}
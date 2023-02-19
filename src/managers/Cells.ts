import { Group, Trigger } from "../engine";
import Utils from "../utils/Utils";
import Config from "../utils/Config";
import { IPoint } from "../utils/types";

import HouseCell from "../objects/cells/buildings/HouseCell";
import LayoutCell from "../objects/cells/buildings/LayoutCell";
import Orders from "./orders/Orders";
import Screen from "./Screen";
import Cell from "../objects/cells/Cell";
import Inventory from "./Inventory";
import Order, { OrderType } from "./orders/Order";
import Objects from "./Objects";

export default class Cells {
    static cellsGroup: Group<Cell> = new Group();

    static onChanged = new Trigger<Cell[]>("cells/on-changed");

    static getCellAt(x: number, y: number): Cell | null {
        return this.cellsGroup.children.find(cell=> {
            return !cell.destroyed && Utils.pointInRect(x, y, cell.x, cell.y, cell.width, cell.height);
        }) || null;
    }
    static getCellAtGrid(x: number, y: number, gridSize: number=Config.GRID_SIZE): Cell | null {
        const pos = Utils.toGridPos(x, y, gridSize);
        
        return this.cellsGroup.children.find(cell=> {
            const cellPos = Utils.toGridPos(cell.x, cell.y, gridSize);

            return !cell.destroyed && cellPos.x == pos.x && cellPos.y == pos.y;
        }) || null;
    }
    static placeCell(cell: Cell, x?: number, y?: number): Cell | null {
        x = Utils.safeValue(x, Objects.cursor.x)
        y = Utils.safeValue(y, Objects.cursor.y)
        
        if (!this.isEmptyAt(x, y, cell.cellsWidth, cell.cellsHeight))
            return null;
        
        const pos = Utils.toGridPos(x, y);
        cell.x = pos.x;
        cell.y = pos.y;
        cell.create();

        this.cellsGroup.add(cell);
        this.onChanged.notify(this.cellsGroup.children);

        return cell;
    }
    static buildCell(cell: Cell, x?: number, y?: number): Cell | null {
        x = Utils.safeValue(x, Objects.cursor.x)
        y = Utils.safeValue(y, Objects.cursor.y)
        
        const layoutCell = new LayoutCell(cell);
        const result = this.placeCell(layoutCell, x, y);
        if (result) {
            Orders.addOrder(new Order(OrderType.BUILD, layoutCell, cell.orderCategory));
        }

        return result;
    }
    static destroyCell(cell: Cell) {
        this.cellsGroup.destroy(cell);
        this.onChanged.notify(this.cellsGroup.children);
    }

    //
    static isEmptyAt(x: number, y: number, cellWidth: number=1, cellHeight: number=1): boolean {
        if (x < 0 || y < 0 || x + cellWidth*Config.GRID_SIZE > Screen.width || y + cellHeight*Config.GRID_SIZE > Screen.height)
            return false;
        
        for (let cy = 0; cy < cellHeight; cy ++) {
            for (let cx = 0; cx < cellWidth; cx ++) {
                const cell = this.getCellAt(x + cx*Config.GRID_SIZE, y + cy*Config.GRID_SIZE);

                if (cell)
                    if (!cell.destroyed || cell.getIsSolid()) return false;
            }
        }
        
        return true;
    }
    static getCells<T extends Cell=Cell>(cellClass: typeof Cell=Cell): T[] {
        return this.cellsGroup.children.filter(cell=> cell instanceof cellClass) as T[];
    }
    static getEmptyPos(xCallback: ()=> number, yCallback: ()=> number): IPoint | null {
        for (let i = 0; i < 10; i ++) {
            const x = xCallback();
            const y = yCallback();
            const isEmpty = this.isEmptyAt(x, y);
            
            if (isEmpty && x < Screen.width && x >= 0 && y < Screen.height && y >= 0) {
                return { x, y };
            }
        }

        return null;
    }
    static getNearestHousesTo(x: number, y: number, human?: Human): HouseCell[] {
        const houses = Cells.getCells<HouseCell>(HouseCell).filter(house=> {
            const isHumanInHouse = !!human && house.hasHuman(human);
            
            return isHumanInHouse || house.getLetIn(human || null);
        });
        return Utils.sortNearestObjectTo(houses, x, y).sort((a, b)=> b.level - a.level);
    }
    static getCanBuildCell(cell: Cell, x?: number, y?: number, ignoreCost: boolean=false): boolean {
        x = Utils.safeValue(x, Objects.cursor.x)
        y = Utils.safeValue(y, Objects.cursor.y)
        
        return (ignoreCost ? true : Inventory.canRemove(cell.getBuildCost())) && this.isEmptyAt(x, y, cell.cellsWidth, cell.cellsHeight)
    }

    //
    static start() {
        
    }
    static update() {
        this.cellsGroup.update();
    }
    static draw() {
        this.cellsGroup.draw();
    }
} 
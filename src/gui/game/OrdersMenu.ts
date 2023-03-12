import Cells from "../../managers/Cells";
import CellsRegistry from "../../registries/CellsRegistry";
import Menu from "../../menus/Menu";
import Screen from "../../managers/Screen";
import Objects from "../../managers/Objects";

export default class OrdersMenu extends Menu {
    currentBuilding: Cell | null = null
    
    constructor() {
        super("orders");

        const regCells = CellsRegistry.getCellsCallbackArray();

        const buildButtons = regCells.map<IMenuButton | null>(cellCallback=> {
            const cell = cellCallback();
            const icon = cell.getPreviewIcon();
            if (!cell.canBeBuilt) return null;
            
            return {
                text: cell.getDisplayName(),
                sprite: icon.name,
                spriteSX: icon.sliceX,
                spriteSY: icon.sliceY,
                onClick: ()=> Cells.buildCell(cellCallback()),
                onEnter: ()=> this.currentBuilding = cell,
                onOut: ()=> this.currentBuilding = null,
                disabled: ()=> !Cells.getCanBuildCell(cell),
                cost: cell.getBuildCost(),
                building: true,
                blur: true
            }
        }).filter(Boolean) as IMenuButton[];
        const plantButtons = regCells.map<IMenuButton | null>(cellCallback=> {
            const cell = cellCallback();
            const icon = cell.getPreviewIcon();
            if (!cell.canBePlanted) return null;
            
            return {
                text: cell.getDisplayName(),
                sprite: icon.name,
                spriteSX: icon.sliceX,
                spriteSY: icon.sliceY,
                onClick: ()=> Cells.plantCell(cellCallback()),
                onEnter: ()=> this.currentBuilding = cell,
                onOut: ()=> this.currentBuilding = null,
                disabled: ()=> !Cells.getCanBuildCell(cell),
                cost: cell.getBuildCost(),
                building: true,
                blur: true
            }
        }).filter(Boolean) as IMenuButton[];
        
        this.tabs = {
            "orders": [],
            "build": buildButtons,
            "plant": plantButtons,
            "place": regCells.map<IMenuButton | null>(cellCallback=> {
                const cell = cellCallback();
                const icon = cell.getPreviewIcon();
                
                return {
                    text: cell.name,
                    sprite: icon.name,
                    spriteSX: icon.sliceX,
                    spriteSY: icon.sliceY,
                    onClick: ()=> Cells.placeCell(cellCallback()),
                    onEnter: ()=> this.currentBuilding = cell,
                    onOut: ()=> this.currentBuilding = null,
                    disabled: ()=> !Cells.getCanBuildCell(cell, undefined, undefined, true),
                    building: true,
                    blur: true
                }
            }).filter(Boolean) as IMenuButton[]
        }
    }
    
    //
    update(): void {
        super.update();

        this.x = Screen.x + Screen.width + 2;
        this.y = Screen.y;

        this.updateTabs()
    }
    updateTabs() {
        const cell = Objects.cursor.cellBelow;
        if (!cell) return;
        
        this.tabs = {
            ...this.tabs,
            "orders": [
                ...cell.getOrdersMenuTab(this)
            ],
            ...cell.getMenuTabs(this)
        }
    }
}
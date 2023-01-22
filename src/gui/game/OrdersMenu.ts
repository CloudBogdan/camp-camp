import Cells from "../../managers/Cells";
import CellsRegistry from "../../registries/CellsRegistry";
import Menu, { IMenuButton } from "../../menus/Menu";
import Inventory from "../../managers/Inventory";
import Objects from "../../managers/Objects";
import Screen from "../../managers/Screen";

export default class OrdersMenu extends Menu {
    constructor() {
        super("orders");

        const regCells = CellsRegistry.getCellsCallbackArray();

        const buttons = regCells.map<IMenuButton | null>(cellCallback=> {
            const cell = cellCallback();
            const icon = cell.getPreviewIcon();
            if (!cell.canBeBuilt) return null;
            
            return {
                text: cell.getDisplayName(),
                sprite: icon.name,
                spriteSX: icon.sliceX,
                spriteSY: icon.sliceY,
                onClick: ()=> Cells.buildCell(cellCallback(), Objects.cursor.x, Objects.cursor.y),
                disabled: ()=> !Inventory.canRemove(cell.getBuildCost()) || !Cells.isEmptyAt(Objects.cursor.x, Objects.cursor.y, cell.cellsWidth, cell.cellsHeight),
                cost: cell.getBuildCost(),
                building: true,
                blur: true
            }
        }).filter(Boolean) as IMenuButton[];
        
        this.tabs = {
            "orders": [],
            "build": buttons,
            "place": regCells.map<IMenuButton | null>(cellCallback=> {
                const cell = cellCallback();
                const icon = cell.getPreviewIcon();
                
                return {
                    text: cell.name,
                    sprite: icon.name,
                    spriteSX: icon.sliceX,
                    spriteSY: icon.sliceY,
                    onClick: ()=> Cells.placeCell(cellCallback(), Objects.cursor.x, Objects.cursor.y),
                    disabled: ()=> !Cells.isEmptyAt(Objects.cursor.x, Objects.cursor.y, cell.cellsWidth, cell.cellsHeight),
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

        this.updateOrders();
    }
    updateOrders() {
        const cellBelow = Objects.cursor.cellBelow;
        if (!cellBelow) return;
        
        this.tabs = {
            ...this.tabs,
            "orders": [
                ...cellBelow.getOrdersMenuTab(this)
            ],
            ...cellBelow.getMenuTabs(this)
        }
    }
}
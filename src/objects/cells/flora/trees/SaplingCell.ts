import { ISpriteIcon } from "../../../../engine";
import Cells from "../../../../managers/Cells";
import { ICost } from "../../../../managers/Inventory";
import Animations from "../../../../utils/Animations";
import Config from "../../../../utils/Config";
import TreePlantCell from "./TreePlantCell";

export default class SaplingCell extends TreePlantCell {
    treeCell: TreePlantCell;
    
    constructor(treeCell: TreePlantCell) {
        super("sapling");

        this.treeCell = treeCell;
        this.canBePlanted = true;
    }

    onGrown(): void {
        super.onGrown();

        this.destroyed = true;
        
        Animations.scaleDown(this, ()=> {
            Cells.destroyCell(this);
            Cells.placeCell(this.treeCell, this.x, this.y);
        })
    }

    //
    getBuildCost(): ICost {
        return this.treeCell.getBuildCost()
    }
    getBreakCost(): ICost {
        return this.treeCell.getBreakCost()
    }
    getDisplayName(): string {
        return this.treeCell.getDisplayName()
    }
    getNamePrefix(): string {
        return "(саженец) " + super.getNamePrefix();
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.treeCell.name,
            sliceX: 0,
            sliceY: 0
        }
    }
    getGrowDuration(): number {
        if (Config.IS_DEV)
            return 120;

        return 3600; // 1 minute
    }
}
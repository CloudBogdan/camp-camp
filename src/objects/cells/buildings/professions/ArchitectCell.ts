import { ISpriteIcon } from "../../../../engine";
import { ICost } from "../../../../managers/Inventory";
import Config from "../../../../utils/Config";
import ArchitectProfession from "../../../entities/human/professions/ArchitectProfession";
import ProfessionCell from "./ProfessionCell";

export default class ArchitectCell extends ProfessionCell {
    constructor() {
        super("architect");

        this.cellsWidth = 2;
        this.animation.frames = [0, 1];

        this.load();
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 25,
                remove: true
            },
            "stone": {
                count: 5,
                remove: true
            }
        }
    }
    getProfession(): HumanProfession {
        return new ArchitectProfession();
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: Config.SPRITE_SIZE,
            sliceY: 0
        }
    }
    getDisplayName(): string {
        return "архитектор"
    }
}
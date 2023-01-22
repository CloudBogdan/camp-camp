import { ISpriteIcon } from "../../../../engine";
import { ICost } from "../../../../managers/Inventory";
import Config from "../../../../utils/Config";
import BuilderProfession from "../../../entities/human/professions/BuilderProfession";
import ProfessionCell from "./ProfessionCell";

export default class BuilderCell extends ProfessionCell {
    constructor() {
        super("builder");

        this.cellsWidth = 2;
        this.animation.frames = [0, 1];

        this.load();
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 20,
                remove: true
            },
            "stone": {
                count: 15,
                remove: true
            }
        }
    }
    getProfession(): HumanProfession {
        return new BuilderProfession()
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: Config.SPRITE_SIZE,
            sliceY: 0
        }
    }
    getDisplayName(): string {
        return "строитель"
    }
}
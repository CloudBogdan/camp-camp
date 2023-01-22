import { ISpriteIcon } from "../../../../engine";
import { ICost } from "../../../../managers/Inventory";
import Config from "../../../../utils/Config";
import GardenerProfession from "../../../entities/human/professions/GardenerProfession";
import ProfessionCell from "./ProfessionCell";

export default class GardenerCell extends ProfessionCell {
    constructor() {
        super("gardener");

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
            }
        }
    }
    getProfession(): HumanProfession {
        return new GardenerProfession()
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: Config.SPRITE_SIZE,
            sliceY: 0
        }
    }
    getDisplayName(): string {
        return "садовод"
    }
}
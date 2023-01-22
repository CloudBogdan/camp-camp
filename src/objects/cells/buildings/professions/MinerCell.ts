import { ISpriteIcon } from "../../../../engine";
import { ICost } from "../../../../managers/Inventory";
import Config from "../../../../utils/Config";
import MinerProfession from "../../../entities/human/professions/MinerProfession";
import ProfessionCell from "./ProfessionCell";

export default class MinerCell extends ProfessionCell {
    constructor() {
        super("miner");

        this.cellsWidth = 2;
        this.animation.frames = [0, 1];

        this.load();
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 30,
                remove: true
            }
        }
    }
    getProfession(): HumanProfession {
        return new MinerProfession()
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: Config.SPRITE_SIZE,
            sliceY: 0
        }
    }
    getDisplayName(): string {
        return "шахтер"
    }
}